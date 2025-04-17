import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image } from "expo-image"; // Sử dụng expo-image
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import FixedHeader from "@/components/custom/FixedHeader";
import { BASE_URL, LOGIN_api, Get_all_like } from "../../api";

interface Product {
    id: string;
    link: string;
    name: string;
    original_price: number;
    discount_price: number;
    discount: number;
}

export default function LikeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = trạng thái đang load
  const [productsLike, setProductsLike] = useState<Product[]>([]); // Dữ liệu sản phẩm yêu thích
  const router = useRouter();

  // Hàm gọi API lấy sản phẩm yêu thích của người dùng
  const fetchFavoriteProducts = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}${Get_all_like}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        // Cập nhật danh sách sản phẩm yêu thích
        setProductsLike(data.products);
      } else {
        console.error("Failed to fetch favorite products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching favorite products:", error);
    }
  };

  useEffect(() => {
    async function checkLogin() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          setIsLoggedIn(false);
          return;
        }
        const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: storedToken }),
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          // Lấy sản phẩm yêu thích sau khi đăng nhập thành công
          fetchFavoriteProducts(storedToken);  // Gọi fetchFavoriteProducts sau khi xác nhận đăng nhập
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setIsLoggedIn(false);
      }
    }
    checkLogin();
  }, []); // useEffect này chỉ chạy một lần khi component mount

  if (isLoggedIn === null) {
    // Loading state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8000" />
      </View>
    );
  }

  if (!isLoggedIn) {
    // Nếu không đăng nhập, hiển thị giao diện với 2 nút "Đăng nhập" và "Đăng ký"
    return (
      <View style={styles.authContainer}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.authButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.authButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Nếu đăng nhập thành công, hiển thị nội dung bình thường
  return (
    <View style={styles.container}>
      <FixedHeader />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn đã thích</Text>
        <FlatList
          data={productsLike}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <CardviewProductSuggest
              product={{
                id: item.id,
                image: { uri: item.link },
                name: item.name,
                original_price: item.original_price, // Giá gốc
                discount_price: item.discount_price, // Giá giảm
                discount: item.discount, // Phần trăm giảm giá
              }}
              onPress={() => {
                router.push(`/product_screen?idp=${encodeURIComponent(item.id)}`);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    color: "#FF8000",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  authButton: {
    backgroundColor: "#FF8000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
