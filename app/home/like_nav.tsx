// screens/LikeScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [productsLike, setProductsLike] = useState<Product[]>([]);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Hàm fetch với timeout 15s
  const fetchFavoriteProducts = useCallback(async (token: string) => {
    setError(null);
    setLoadingLike(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${BASE_URL}${Get_all_like}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      const data = await response.json();

      if (response.status === 200) {
        setProductsLike(data.products);
      } else if (response.status === 404) {
        setError("Không có sản phẩm yêu thích");
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại sau");
      }
    } catch (err: any) {
      setError("Kết nối tới server. Vui lòng thử lại sau");
    } finally {
      clearTimeout(timeoutId);
      setLoadingLike(false);
      setLoadingScreen(false);
    }
  }, []);

  // Check login + fetch lần đầu
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          setIsLoggedIn(false);
          setLoadingScreen(false);
          return;
        }
        const resp = await fetch(`${BASE_URL}${LOGIN_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: storedToken }),
        });
        if (resp.status === 200) {
          setIsLoggedIn(true);
          await fetchFavoriteProducts(storedToken);
        } else {
          setIsLoggedIn(false);
          setLoadingScreen(false);
        }
      } catch {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể xác thực, vui lòng kiểm tra kết nối và thử lại.",
          [{ text: "OK", onPress: () => router.push("/login") }],
          { cancelable: false }
        );
      }
    })();
  }, [fetchFavoriteProducts, router]);

  // Khi màn hình quay lại focus, nếu đã login thì re-fetch
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        AsyncStorage.getItem("token").then(token => {
          if (token) fetchFavoriteProducts(token);
        });
      }
    }, [isLoggedIn, fetchFavoriteProducts])
  );

  // màn hình loading chung
  if (loadingScreen) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8000" />
      </View>
    );
  }

  // nếu chưa login
  if (!isLoggedIn) {
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

  // UI khi đã login
  return (
    <View style={styles.container}>
      <FixedHeader />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn đã thích</Text>

        {loadingLike && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Đang tải...</Text>
          </View>
        )}

        {!loadingLike && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            {error !== "Không có sản phẩm yêu thích" && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={async () => {
                  setLoadingLike(true);
                  const token = await AsyncStorage.getItem("token");
                  if (token) fetchFavoriteProducts(token);
                }}
              >
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {!loadingLike && !error && (
          <FlatList
            data={productsLike}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <CardviewProductSuggest
                product={{
                  id: item.id,
                  image: { uri: item.link },
                  name: item.name,
                  original_price: item.original_price,
                  discount_price: item.discount_price,
                  discount: item.discount,
                }}
                onPress={() =>
                  router.push(`/product_screen?idp=${encodeURIComponent(item.id)}`)
                }
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingBottom: 40 },
  contentContainer: { flex: 1, paddingHorizontal: 5, paddingTop: 10 },
  title: { fontSize: 20, fontWeight: "bold", color: "#FF8000", marginBottom: 10 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  authContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9",
  },
  authButton: {
    backgroundColor: "#FF8000", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginBottom: 10,
  },
  authButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  statusContainer: { alignItems: "center", marginTop: 20 },
  statusText: { fontSize: 16, color: "#333" },

  errorContainer: { alignItems: "center", marginTop: 20 },
  errorText: { color: "#ff3b30", fontSize: 16, marginBottom: 12 },
  retryButton: {
    backgroundColor: "#FF8000", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
