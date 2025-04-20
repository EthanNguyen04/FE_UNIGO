import React, { useState, useEffect } from "react";
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
import { BASE_URL, Get_cart, Im_URL } from "../../api";
import { useRouter } from "expo-router";

const CartScreen: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<Cart[]>([]); // Dữ liệu sản phẩm trong giỏ
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Lưu trữ các index của sản phẩm được chọn
  const router = useRouter();

  // Hàm call API Get_cart để lấy danh sách sản phẩm trong cart của user
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        ToastAndroid.show("Không tìm thấy token", ToastAndroid.SHORT);
        setLoading(false);
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
        // API trả về { products: [...] }
        setCartProducts(data.products);
      } else {
        ToastAndroid.show(`Lỗi: ${data.error || data.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Hàm xử lý chọn item theo index
  const handleSelectItem = (index: number) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index); // Nếu đã chọn, bỏ chọn
      } else {
        return [...prevSelected, index]; // Nếu chưa chọn, thêm vào
      }
    });
  };

  // Hàm xóa sản phẩm đã chọn
  const handleDeleteSelected = () => {
    setCartProducts((prevProducts) => {
      // Lọc bỏ các sản phẩm đã chọn
      const newProducts = prevProducts.filter((_, index) => !selectedItems.includes(index));
      setSelectedItems([]); // Xóa các sản phẩm đã chọn khỏi trạng thái
      return newProducts;
    });
  };

  // Tính tổng tiền của các sản phẩm được chọn
  const totalSelectedPrice = selectedItems.reduce((total, index) => {
    const item = cartProducts[index];
    return total + item.price * item.quantity;
  }, 0);

  // Kiểm tra xem có sản phẩm nào được chọn hay không để quyết định màu nút thanh toán
  const isAnyItemSelected = selectedItems.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="Giỏ hàng" />
      {/* Nút Xóa ở góc trên bên phải */}
      {isAnyItemSelected && (
        <View style={styles.deleteContainer}>
          <TouchableOpacity  onPress={handleDeleteSelected}>
            <Text style={styles.deleteButtonText}>
              Xóa ({selectedItems.length}) {/* Hiển thị số lượng sản phẩm đã chọn */}
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
            keyExtractor={(item, index) => `${item.productId}-${index}`} // Thêm index vào key để đảm bảo uniqueness
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const imageUrl = item.firstImage ? `${Im_URL}${item.firstImage}` : "";
              return (
                <ItemProductCart
                  productId={item.productId}
                  name={item.name}
                  firstImage={imageUrl}
                  color={item.color}
                  size={item.size}
                  quantity={item.quantity}
                  price={item.price}
                  onPress={() => handleSelectItem(index)}
                  selected={selectedItems.includes(index)} // Truyền selected theo index
                />
              );
            }}
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
          style={[styles.buyButton, { backgroundColor: isAnyItemSelected ? "#FF6600" : "#D3D3D3" }]} // Thay đổi màu nút thanh toán
          onPress={() => {
            if (isAnyItemSelected) {
              // Tạo danh sách sản phẩm được chọn theo định dạng yêu cầu
              const selectedProducts = selectedItems.map((index) => {
                const item = cartProducts[index];
                return {
                  product_id: item.productId,
                  name: item.name,
                  price: item.price,
                  size: item.size,
                  color: item.color,
                  quantity: item.quantity,
                };
              });
              // Điều hướng sang order_screen và truyền selectedProducts qua params
              router.push({
                pathname: "/order_screen",
                params: { selectedProducts: JSON.stringify(selectedProducts) },
              });
            }
          }}
        >
          <Text style={styles.buyButtonText}>Mua hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    paddingTop: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  // Nút xóa ở góc trên bên phải
  deleteContainer: {
    position: "absolute",
    top: 40, // Đặt dưới header
    right: 10,
    padding: 5
  },
  deleteButtonText: {
    color: "#AEAEAE", // Màu xám
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CartScreen;
