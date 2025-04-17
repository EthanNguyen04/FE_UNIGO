import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Image } from "expo-image"; // Sử dụng expo-image cho load ảnh từ URL
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import { useRouter } from "expo-router";
import FixedHeader from "@/components/custom/FixedHeader";
import { BASE_URL, Get_product_sale_api, Get_productdx_api } from "../../api";

const screenWidth = Dimensions.get("window").width;

interface ProductSale {
  id: string;
  link: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

interface ProductSuggest {
  id: string;
  link: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

export default function HomeScreen() {
  const [productsSale, setProductsSale] = useState<ProductSale[]>([]);
  const [productsSuggest, setProductsSuggest] = useState<ProductSuggest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const handleXemDxuat = () => {
    // Chuyển hướng đến trang sale (đổi đường dẫn nếu cần)
    //router.push("/listProduct");
    router.push(`/listProduct`)
  };
  const handleSale = () => {
    // Chuyển hướng đến trang sale (đổi đường dẫn nếu cần)
    //router.push("/listProduct");
    router.push(`/flash_sale_screen`)
  };
  useEffect(() => {
    async function fetchProducts() {
      // Fetch products_sale
      try {
        const saleResponse = await fetch(`${BASE_URL}${Get_product_sale_api}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const saleData = await saleResponse.json();
        if (saleData && saleData.products) {
          setProductsSale(saleData.products);
        } else {
          Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm giảm giá.");
        }
      } catch (error) {
        console.error("Error fetching products sale:", error);
        Alert.alert("Lỗi", "Không thể tải sản phẩm giảm giá.");
      }

      // Fetch products_dx
      try {
        const dxResponse = await fetch(`${BASE_URL}${Get_productdx_api}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const dxData = await dxResponse.json();
        if (dxData && dxData.products) {
          setProductsSuggest(dxData.products);
        } else {
          Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm đề xuất.");
        }
      } catch (error) {
        console.error("Error fetching products suggest:", error);
        Alert.alert("Lỗi", "Không thể tải sản phẩm đề xuất.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <FixedHeader />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner */}
        <Image
          source={require("../../assets/images/banner.png")}
          contentFit="contain"
          style={styles.image_Banner}
        />

        {/* Danh sách sản phẩm giảm giá */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Image
              source={require("../../assets/images/sale_img.gif")}
              style={styles.image_gif}
              contentFit="contain"
            />
           <TouchableOpacity onPress={handleSale}>
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
                  onPress={() => {
                    console.log(`Navigating to product_screen with id: ${item.id}`); // Debug log
                    router.push(`/product_screen?idp=${encodeURIComponent(item.id)}`);
                  }}
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

        {/* Danh mục đề xuất */}
        <View style={styles.dxHeader}>
          <Text style={styles.textDexuat}>Đề xuất</Text>
          <TouchableOpacity onPress={handleXemDxuat}>
            <Text style={styles.textSale}>Xem {">"}</Text>
          </TouchableOpacity>
        </View>

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
              onPress={() => {
                router.push(`/product_screen?idp=${encodeURIComponent(item.id)}`);

              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  image_Banner: {
    width: "100%",
    alignSelf: "center",
    aspectRatio: 10 / 3,
  },
  image_gif: {
    width: "25%",
    aspectRatio: 6 / 3,
  },
  saleSection: {
    marginBottom: 10,
  },
  saleHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },
  dxHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 8,

  },
  textDexuat: {
    textAlign: "left",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8000",
  },
  textSale: {
    textAlign: "right",
    marginRight: 30,
    color: "#FF8000",
    padding: 10
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  divider: {
    width: screenWidth * 0.95,
    height: 1,
    backgroundColor: "rgb(202, 202, 202)",
    marginHorizontal: screenWidth * 0.01,
    justifyContent: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#FF8000",
    marginVertical: 10,
  },
});
