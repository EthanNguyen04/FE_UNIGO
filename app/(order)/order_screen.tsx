import React, { useState, useEffect } from "react";
import { 
  ScrollView,
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  ToastAndroid, 
  Alert 
} from "react-native";
import ItemProductOrder, { Order } from "../../components/order/item_product_order";
import HeaderWithBack from "@/components/custom/headerBack";
import { useLocalSearchParams, useRouter } from "expo-router";
import DeliveryInfo from "@/components/order/info_order";
import DiscountSelector from "@/components/order/choose_discount";
import PaymentSelector from "@/components/order/payment";

const OrderScreen: React.FC = () => {
  // Lấy dữ liệu từ param truyền qua (CartScreen đã stringify JSON trước khi chuyển)
  const params = useLocalSearchParams<{ selectedProducts?: string }>();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (params.selectedProducts) {
      try {
        // Phân tích chuỗi JSON nhận được, đảm bảo nếu thiếu key image thì gán chuỗi rỗng
        const parsedOrders = JSON.parse(params.selectedProducts) as Order[];
        const ordersWithDefaultImage = parsedOrders.map(item => ({
          ...item,
          image: item.image || ""  // Nếu chưa có image
        }));
        setOrders(ordersWithDefaultImage);
      } catch (error) {
        console.error("Error parsing selectedProducts:", error);
      }
    }
  }, [params.selectedProducts]);

  // Tính tổng tiền theo giá * số lượng
  const totalPrice = orders.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <HeaderWithBack title="Đơn hàng" />
      <DeliveryInfo />
      
      {/* Sửa style cho ScrollView: bỏ flex: 1 để nó chỉ cao bằng nội dung */}
      <ScrollView style={styles.container} >
        {loading ? (
          <ActivityIndicator size="large" color="#FF6600" />
        ) : (
          orders.map((order) => (
            <View 
              key={order.product_id} 
              style={{ marginBottom: 2 }}
            >
              <ItemProductOrder {...order} />
            </View>
          ))
        )}
      </ScrollView>
      
      <DiscountSelector 
        discountCode="" 
        onPress={() => Alert.alert("Chọn mã giảm giá")}
      />
      
      <View style={styles.containerPayment}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalText}>
            Tổng thanh toán ({orders.length})
          </Text>
          <Text style={styles.priceText}>
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={() => {
            ToastAndroid.show("Tiến hành đặt hàng", ToastAndroid.SHORT);
          }}
        >
          <Text style={styles.buyButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerSafeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  // Ở đây loại bỏ flex: 1 để ScrollView chỉ cao bằng nội dung của nó
  container: {
  },
  containerPayment: {
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: {
    gap: 4,
  },
  totalText: {
    fontSize: 14,
    color: "#333",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6600",
  },
  buyButton: {
    backgroundColor: "#FF6600",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OrderScreen;
