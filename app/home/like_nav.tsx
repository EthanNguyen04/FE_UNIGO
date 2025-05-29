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
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
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

const { width: screenWidth } = Dimensions.get("window");

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
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

  // nếu chưa login
  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authContent}>
          <View style={styles.authIconContainer}>
            <MaterialIcons name="favorite-border" size={80} color="#e2e8f0" />
          </View>
          <Text style={styles.authTitle}>Đăng nhập để xem yêu thích</Text>
          <Text style={styles.authSubtitle}>
            Lưu các sản phẩm bạn yêu thích để xem lại sau
          </Text>
          
          <View style={styles.authButtonContainer}>
            <TouchableOpacity
              style={[styles.authButton, styles.loginButton]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.authButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.registerButton]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // UI khi đã login
  return (
    <View style={styles.container}>
      <FixedHeader />

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="favorite" size={28} color="#e91e63" />
            <Text style={styles.title}>Sản phẩm yêu thích</Text>
          </View>
          {!loadingLike && !error && productsLike.length > 0 && (
            <Text style={styles.countText}>{productsLike.length} sản phẩm</Text>
          )}
        </View>

        {loadingLike && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.statusText}>Đang tải danh sách yêu thích...</Text>
          </View>
        )}

        {!loadingLike && error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorContent}>
              <MaterialIcons 
                name={error === "Không có sản phẩm yêu thích" ? "favorite-border" : "error-outline"} 
                size={64} 
                color="#f87171" 
              />
              <Text style={styles.errorTitle}>
                {error === "Không có sản phẩm yêu thích" ? "Chưa có sản phẩm yêu thích" : "Có lỗi xảy ra"}
              </Text>
              <Text style={styles.errorSubtext}>
                {error === "Không có sản phẩm yêu thích" 
                  ? "Hãy khám phá và thêm những sản phẩm bạn thích vào danh sách"
                  : error
                }
              </Text>
              {error !== "Không có sản phẩm yêu thích" && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={async () => {
                    setLoadingLike(true);
                    const token = await AsyncStorage.getItem("token");
                    if (token) fetchFavoriteProducts(token);
                  }}
                >
                  <MaterialIcons name="refresh" size={20} color="#fff" />
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {!loadingLike && !error && productsLike.length > 0 && (
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
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc", 
    paddingBottom: 40 
  },
  contentContainer: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 16 
  },
  
  // Header Section
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: { 
    fontSize: 15, 
    fontWeight: "800", 
    color: "#1e293b",
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  countText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // Loading States
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },

  // Auth States
  authContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
  },
  authContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  authIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  authButtonContainer: {
    width: "100%",
    gap: 12,
  },
  authButton: {
    paddingVertical: 14, 
    paddingHorizontal: 32, 
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: "#667eea",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  authButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700" 
  },
  registerButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "700",
  },

  // Status & Error States
  statusContainer: { 
    alignItems: "center", 
    marginTop: 80,
    paddingHorizontal: 24,
  },
  statusText: { 
    fontSize: 16, 
    color: "#64748b",
    marginTop: 16,
    fontWeight: "500",
  },

  errorContainer: { 
    flex: 1,
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorContent: {
    alignItems: "center",
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  retryText: { 
    color: "#fff", 
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },

  // Product List
  columnWrapper: { 
    justifyContent: "space-between", 
    marginBottom: 16,
    // paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
});