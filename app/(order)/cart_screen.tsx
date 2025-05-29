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
import { AntDesign } from "@expo/vector-icons";

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
        firstImage: item.firstImage ? `${Im_URL}${item.firstImage}` : "", // thêm dòng này
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

      {/* Delete Button */}
      {isAnyItemSelected && (
        <View style={styles.deleteContainer}>
          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <AntDesign name="delete" size={18} color="#E74C3C" />
            <Text style={styles.deleteButtonText}>
              Xóa ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C5CE7" />
            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
          </View>
        ) : cartProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AntDesign name="shoppingcart" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptySubtitle}>Hãy thêm sản phẩm vào giỏ hàng của bạn</Text>
          </View>
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
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Bottom Payment Section */}
      {cartProducts.length > 0 && (
        <View style={styles.bottomSection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Đã chọn:</Text>
              <Text style={styles.summaryValue}>{selectedItems.length} sản phẩm</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalPrice}>
                {totalSelectedPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.buyButton,
              {
                backgroundColor: isAnyItemSelected ? "rgb(0, 200, 255)" : "#e0e0e0",
                shadowColor: isAnyItemSelected ? "#6C5CE7" : "transparent",
              },
            ]}
            onPress={handleBuy}
            disabled={!isAnyItemSelected}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.buyButtonText,
              { color: isAnyItemSelected ? "#fff" : "#aaa" }
            ]}>
              {isAnyItemSelected ? "Mua hàng ngay" : "Chọn sản phẩm"}
            </Text>
            {isAnyItemSelected && (
              <AntDesign name="arrowright" size={20} color="#fff" style={styles.buyButtonIcon} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  container: {
    flex: 1,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  deleteContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    zIndex: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffebee",
  },
  deleteButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(255, 0, 0,0.8)",
    letterSpacing: 0.5,
  },
  buyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  buyButtonText: {
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  buyButtonIcon: {
    marginLeft: 4,
  },
});

export default CartScreen;