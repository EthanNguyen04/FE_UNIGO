import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import FixedHeader from "@/components/custom/FixedHeader";
import { BASE_URL, Get_product_sale_api, Get_productdx_api } from "../../api";

const screenWidth = Dimensions.get("window").width;

interface Product {
  id: string;
  link: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

export default function HomeScreen() {
  const [productsSale, setProductsSale] = useState<Product[]>([]);
  const [productsSuggest, setProductsSuggest] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    // Nếu đây là pull-to-refresh thì chỉ setRefreshing, không touch isLoading
    if (!refreshing) setIsLoading(true);

    // Fetch sale
    try {
      const saleRes = await fetch(`${BASE_URL}${Get_product_sale_api}`);
      const saleData = await saleRes.json();
      if (saleRes.ok && saleData.products) {
        setProductsSale(saleData.products);
      } else {
        Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm giảm giá.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải sản phẩm giảm giá.");
    }

    // Fetch đề xuất
    try {
      const dxRes = await fetch(`${BASE_URL}${Get_productdx_api}`);
      const dxData = await dxRes.json();
      if (dxRes.ok && dxData.products) {
        setProductsSuggest(dxData.products);
      } else {
        Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm đề xuất.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải sản phẩm đề xuất.");
    }

    setIsLoading(false);
    setRefreshing(false);
  }, [refreshing]);

  // Load lần đầu và khi focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  // Handler khi pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  return (
    <View style={styles.container}>
      <FixedHeader />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner */}
        <Image
          source={require("../../assets/images/banner.png")}
          contentFit="contain"
          style={styles.image_Banner}
        />

        {/* Sản phẩm giảm giá */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Image
              source={require("../../assets/images/sale_img.gif")}
              style={styles.image_gif}
              contentFit="contain"
            />
            <TouchableOpacity onPress={() => router.push("/flash_sale_screen")}>
              <Text style={styles.textSale}>Xem {">"}</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
          ) : (
            <FlatList
              horizontal
              data={productsSale}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/product_screen?idp=${encodeURIComponent(item.id)}`
                    )
                  }
                >
                  <CardviewProductSale
                    product={{
                      id: item.id,
                      image: { uri: item.link },
                      name: item.name,
                      original_price: item.discount_price,
                      discount_price: item.original_price,
                      discount: item.discount,
                    }}
                  />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Đề xuất */}
        <View style={styles.dxHeader}>
          <Text style={styles.textDexuat}>Đề xuất</Text>
          <TouchableOpacity onPress={() => router.push("/listProduct")}>
            <Text style={styles.textSale}>Xem {">"}</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Đang tải đề xuất...</Text>
        ) : (
          <FlatList
            data={productsSuggest}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <CardviewProductSuggest
                product={{
                  id: item.id,
                  image: { uri: item.link },
                  name: item.name,
                  original_price: item.discount_price,
                  discount_price: item.original_price,
                  discount: item.discount,
                }}
                onPress={() =>
                  router.push(
                    `/product_screen?idp=${encodeURIComponent(item.id)}`
                  )
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingBottom: 40 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 5 },
  image_Banner: { width: "100%", alignSelf: "center", aspectRatio: 10 / 3 },
  image_gif: { width: "25%", aspectRatio: 6 / 3 },
  saleSection: { marginBottom: 10 },
  saleHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dxHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 8,
  },
  textDexuat: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8000",
  },
  textSale: {
    marginRight: 30,
    color: "#FF8000",
    padding: 10,
  },
  columnWrapper: { justifyContent: "space-between" },
  divider: {
    width: screenWidth * 0.95,
    height: 1,
    backgroundColor: "#cacaca",
    marginHorizontal: screenWidth * 0.01,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#FF8000",
    marginVertical: 10,
  },
});
