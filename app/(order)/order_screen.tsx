// src/screens/OrderScreen.tsx
import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import ItemProductOrder, { Order } from "../../components/order/item_product_order";
import HeaderWithBack from "@/components/custom/headerBack";
import DeliveryAddressPicker, { AddressItem } from "@/components/order/DeliveryAddressPicker";
import DiscountSelector from "@/components/order/choose_discount";
import {
  BASE_URL,
  get_discount_today,
  Post_order,
  Delete_carts,
  Create_payment,
} from "../../api";

interface Discount {
  id: string;
  code: string;
  discount_percent: number;
  min_order_value: number;
}

const OrderScreen: React.FC = () => {
  const router = useRouter();
  const { selectedProducts } = useLocalSearchParams<{ selectedProducts?: string }>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<AddressItem | null>(null);

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [discountModalVisible, setDiscountModalVisible] = useState(false);

  // Parse lại danh sách Order khi màn init
  useEffect(() => {
    if (selectedProducts) {
      setLoadingOrders(true);
      try {
        const parsed = JSON.parse(selectedProducts) as Order[];
        setOrders(parsed.map(o => ({ ...o, image: o.image || "" })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    }
  }, [selectedProducts]);

  // Load mã giảm giá
  useEffect(() => {
    (async () => {
      setLoadingDiscounts(true);
      try {
        const res = await fetch(`${BASE_URL}${get_discount_today}`);
        if (res.ok) {
          const { discounts } = await res.json();
          setDiscounts(discounts.map((d: any) => ({
            id: d._id,
            code: d.code,
            discount_percent: d.discount_percent,
            min_order_value: d.min_order_value,
          })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDiscounts(false);
      }
    })();
  }, []);

  // Tính giá
  const totalPrice = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const discountAmount = selectedDiscount
    ? Math.floor((totalPrice * selectedDiscount.discount_percent) / 100)
    : 0;
  const finalTotal = totalPrice - discountAmount;

  const applyDiscount = (d: Discount) => {
    setSelectedDiscount(d);
    setDiscountModalVisible(false);
  };

  // 1) Tạo order → 2) xóa cart → 3) tạo payment URL → 4) chuyển sang PaymentScreen
  const handleCheckout = async () => {
    if (!shippingAddress) {
      return ToastAndroid.show("Vui lòng chọn địa chỉ giao hàng", ToastAndroid.SHORT);
    }
    // Gom nhóm products
    const grouped: Record<string, any> = {};
    orders.forEach(o => {
      if (!grouped[o.product_id]) grouped[o.product_id] = { product_id: o.product_id, variants: [] };
      grouped[o.product_id].variants.push({
        price: o.price * o.quantity,
        attributes: { color: o.color, size: o.size, quantity: o.quantity },
      });
    });

    const orderPayload = {
      products: Object.values(grouped),
      shipping_address: {
        address: shippingAddress.addressDetail,
        phone: shippingAddress.phone,
      },
      discount_code_id: selectedDiscount?.id || null,
      total_price_before_discount: totalPrice,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Bạn cần đăng nhập");

      // 1) Tạo order
      const orderRes = await fetch(`${BASE_URL}${Post_order}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });
      const { order, message } = await orderRes.json();
      if (!orderRes.ok) throw new Error(message);

      const order_Id = order._id;
      console.log(order_Id)

      // 2) Xóa cart items
      await fetch(`${BASE_URL}${Delete_carts}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: orders.map(o => ({
            product_id: o.product_id,
            color: o.color,
            size: o.size,
          })),
        }),
      });

      // 3) Tạo payment URL
      const payRes = await fetch(`${BASE_URL}${Create_payment}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order_Id,
          amount: finalTotal,
          orderInfo: `Thanh toan don ${order_Id}`,
          orderType: "other",
        }),
      });
      const payData = await payRes.json();
      if (!payRes.ok || payData.code !== "00") {
        throw new Error(payData.message || "Lỗi tạo giao dịch thanh toán");
      }
      console.log("pay" + payData.data)

      // 4) Điều hướng sang PaymentScreen
      router.replace({
        pathname: "/paymentScreen",
        params: {
          paymentUrl: payData.data,
          order_Id,
        },
      });

    } catch (err: any) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Đơn hàng" />
      <DeliveryAddressPicker onSelect={setShippingAddress} />

      {loadingOrders ? (
        <ActivityIndicator style={styles.loader} size="large" color="#FF6600" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => `${o.product_id}-${o.color}-${o.size}`}
          renderItem={({ item }) => <ItemProductOrder {...item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <DiscountSelector
        discountCode={selectedDiscount?.code}
        discountPercent={selectedDiscount?.discount_percent}
        onPress={() => setDiscountModalVisible(true)}
      />

      <Modal
        visible={discountModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDiscountModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
            {loadingDiscounts ? (
              <ActivityIndicator size="small" color="#FF6600" />
            ) : (
              <FlatList
                data={discounts.filter(d => totalPrice >= d.min_order_value)}
                keyExtractor={d => d.id}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    underlayColor="#eee"
                    onPress={() => applyDiscount(item)}
                  >
                    <View
                      style={[
                        styles.modalItem,
                        item.id === selectedDiscount?.id && styles.selectedItem,
                      ]}
                    >
                      <Text style={styles.modalCode}>{item.code}</Text>
                      <Text style={styles.modalPercent}>
                        Giảm {item.discount_percent}%
                      </Text>
                      <Text style={styles.modalMinValue}>
                        Đơn tối thiểu:{" "}
                        {item.min_order_value.toLocaleString("vi-VN")}₫
                      </Text>
                    </View>
                  </TouchableHighlight>
                )}
                ItemSeparatorComponent={() => <View style={styles.line} />}
                ListEmptyComponent={<Text>Không có mã phù hợp</Text>}
              />
            )}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setDiscountModalVisible(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tổng giá */}
      <View style={styles.priceBox}>
        <Text style={styles.text}>
         Tạm tính:{" "}
          {totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        {selectedDiscount && (
          <Text style={styles.text}>
            Giảm {selectedDiscount.discount_percent}%:{" "}
            -{discountAmount.toLocaleString("vi-VN")}₫
          </Text>
        )}
        <Text style={styles.textBold}>
          Thanh toán:{" "}
          {finalTotal.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payBtn,
            !shippingAddress && styles.disabledBtn,
          ]}
          onPress={handleCheckout}
          disabled={!shippingAddress}
        >
          <Text style={styles.payText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 4,
  },
  priceBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  text: {
    fontSize: 15,
    color: "#555",
    marginVertical: 2,
  },
  textBold: {
    fontSize: 17,
    color: "rgb(255, 0, 0)",
    fontWeight: "700",
    marginTop: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  payBtn: {
    backgroundColor: "#FF6B3C",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  disabledBtn: {
    backgroundColor: "#CFCFCF",
    shadowOpacity: 0,
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F9F9F9",
  },
  selectedItem: {
    backgroundColor: "#FFF2EC",
    borderColor: "#FF6B3C",
    borderWidth: 1.5,
  },
  modalCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalPercent: {
    fontSize: 14,
    color: "#FF6B3C",
    marginTop: 6,
  },
  modalMinValue: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  line: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  closeBtn: {
    marginTop: 18,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 26,
    backgroundColor: "#FF6B3C",
    borderRadius: 20,
    elevation: 2,
  },
  closeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});