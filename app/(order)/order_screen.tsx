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
      totalPriceIn: totalPrice,
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
      console.log("pay" +payData.data)

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

      {/* Tổng giá */}
      <View style={styles.priceBox}>
        <Text style={styles.text}>
          Tổng:{" "}
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
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 4 },
  priceBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  text: { fontSize: 14, color: "#333", marginVertical: 2 },
  textBold: { fontSize: 16, color: "#FF6600", fontWeight: "bold" },
  footer: { padding: 12, backgroundColor: "#fff" },
  payBtn: { backgroundColor: "#FF6600", padding: 12, borderRadius: 6 },
  disabledBtn: { backgroundColor: "#ccc" },
  payText: { color: "#fff", textAlign: "center", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalItem: { padding: 12, borderRadius: 4 },
  selectedItem: { backgroundColor: "#FFEBE6", borderWidth: 1, borderColor: "#FF6600" },
  modalCode: { fontSize: 16, fontWeight: "bold" },
  modalPercent: { fontSize: 14, color: "#FF6600", marginTop: 4 },
  modalMinValue: { fontSize: 12, color: "#666", marginTop: 2 },
  line: { height: 1, backgroundColor: "#ddd" },
  closeBtn: { marginTop: 12, alignSelf: "center" },
  closeText: { color: "#FF6600", fontSize: 16 },
});
