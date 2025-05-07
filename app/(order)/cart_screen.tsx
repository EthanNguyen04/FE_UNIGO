// src/screens/CartScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import ItemProductCart, { Cart } from "../../components/order/item_product_cart";
import HeaderWithBack from "@/components/custom/headerBack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Get_cart, Im_URL, Delete_carts } from "../../api";
import { useRouter } from "expo-router";

const CartScreen: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        ToastAndroid.show("Không tìm thấy token", ToastAndroid.SHORT);
        return;
      }
      const response = await fetch(`${BASE_URL}${Get_cart}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCartProducts(data.products);
      } else {
        ToastAndroid.show(`Lỗi: ${data.error || data.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleSelectItem = useCallback((index: number) => {
    setSelectedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.length === 0) return;

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      ToastAndroid.show("Bạn cần đăng nhập", ToastAndroid.SHORT);
      return;
    }

    // Chuẩn bị payload
    const productsToDelete = selectedItems.map(idx => {
      const item = cartProducts[idx];
      return {
        product_id: item.productId,
        color: item.color,
        size: item.size,
      };
    });

    try {
      // Gọi API xóa
      const res = await fetch(`${BASE_URL}${Delete_carts}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products: productsToDelete }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Xóa giỏ hàng thất bại");
      }
      // Cập nhật state local
      setCartProducts(prev =>
        prev.filter((_, idx) => !selectedItems.includes(idx))
      );
      setSelectedItems([]);
      ToastAndroid.show("Xóa thành công", ToastAndroid.SHORT);
    } catch (e: any) {
      console.error("Error deleting carts:", e);
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  }, [selectedItems, cartProducts]);

  const totalSelectedPrice = selectedItems.reduce((sum, idx) => {
    const item = cartProducts[idx];
    return sum + item.price * item.quantity;
  }, 0);

  const isAnyItemSelected = selectedItems.length > 0;

  const handleBuy = useCallback(() => {
    if (!isAnyItemSelected) return;
    const selectedProducts = selectedItems.map(idx => {
      const item = cartProducts[idx];
      return {
        product_id: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      };
    });
    router.push({
      pathname: "/order_screen",
      params: { selectedProducts: JSON.stringify(selectedProducts) },
    });
  }, [isAnyItemSelected, selectedItems, cartProducts, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="Giỏ hàng" />
      {isAnyItemSelected && (
        <View style={styles.deleteContainer}>
          <TouchableOpacity onPress={handleDeleteSelected}>
            <Text style={styles.deleteButtonText}>
              Xóa ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6600" />
        ) : (
          <FlatList
            data={cartProducts}
            keyExtractor={(item, idx) => `${item.productId}-${idx}`}
            renderItem={({ item, index }) => (
              <ItemProductCart
                {...item}
                firstImage={
                  item.firstImage ? `${Im_URL}${item.firstImage}` : ""
                }
                onPress={() => handleSelectItem(index)}
                selected={selectedItems.includes(index)}
                onImagePress={() =>
                  router.push(
                    `/product_screen?idp=${encodeURIComponent(
                      item.productId
                    )}`
                  )
                }
                onIncrement={newQty => {
                  /* nếu muốn cập nhật quantity local trước */
                  setCartProducts(prev => {
                    const copy = [...prev];
                    copy[index] = { ...copy[index], quantity: newQty };
                    return copy;
                  });
                }}
                onDecrement={newQty => {
                  setCartProducts(prev => {
                    const copy = [...prev];
                    copy[index] = { ...copy[index], quantity: newQty };
                    return copy;
                  });
                }}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </View>
      <View style={styles.containerPayment}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalText}>
            Tổng thanh toán ({selectedItems.length})
          </Text>
          <Text style={styles.priceText}>
            {totalSelectedPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.buyButton,
            { backgroundColor: isAnyItemSelected ? "#FF6600" : "#D3D3D3" },
          ]}
          onPress={handleBuy}
          disabled={!isAnyItemSelected}
        >
          <Text style={styles.buyButtonText}>Mua hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f0f0" },
  container: { flex: 1, paddingTop: 12 },
  containerPayment: {
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: { gap: 4 },
  totalText: { fontSize: 14, color: "#333" },
  priceText: { fontSize: 16, fontWeight: "bold", color: "#FF6600" },
  buyButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 },
  buyButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  deleteContainer: {
    position: "absolute",
    top: 20,
    right: 10,
    padding: 5,
  },
  deleteButtonText: {
    color: "#AEAEAE",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CartScreen;
