import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Image as RNImage,
  ImageSourcePropType,
} from "react-native";
import { router } from "expo-router";
import FixedHeader from "@/components/custom/FixedHeader";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import { BASE_URL } from "../../api";

const screenWidth = Dimensions.get("window").width;

interface ProductSale {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  image: ImageSourcePropType;
}

interface ProductSuggest {
  id: string;
  name: string;
  price: number;
  priceSale: number;
  image: ImageSourcePropType;
}

export default function HomeScreen() {
  const [productsSale, setProductsSale] = useState<ProductSale[]>([]);
  const [productsSuggest, setProductsSuggest] = useState<ProductSuggest[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ FLASH SALE
        const saleRes = await fetch(`${BASE_URL}/api/product/products_sale`);
        const saleJson = await saleRes.json();

        const sortedSale = saleJson.products
          .sort((a: any, b: any) => b.discount_percent - a.discount_percent)
          .slice(0, 10); // Lấy tối đa 10 sản phẩm

        const saleData: ProductSale[] = sortedSale.map((item: any) => ({
          id: item.id,
          name: item.name,
          oldPrice: item.price,
          newPrice: item.sale_price,
          discount: `${item.discount_percent}%`,
          image: { uri: `${BASE_URL}${item.link}` },
        }));

        setProductsSale(saleData);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API sản phẩm sale:", error);
      }

      try {
        // ✅ SẢN PHẨM ĐỀ XUẤT
        const suggestRes = await fetch(`${BASE_URL}/api/product/products_dx`);
        const suggestJson = await suggestRes.json();

        const limitedSuggest = suggestJson.products.slice(0, 20); // Lấy tối đa 20 sản phẩm

        const suggestData: ProductSuggest[] = limitedSuggest.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.original_price,
          priceSale: item.discount_price,
          image: { uri: `${BASE_URL}${item.link}` },
        }));

        setProductsSuggest(suggestData);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API sản phẩm đề xuất:", error);
      }
    };

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
        <RNImage
          source={require("../../assets/images/banner.png")}
style={styles.image_Banner}
        />

        {/* FLASH SALE */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <RNImage
              source={require("../../assets/images/sale_img.gif")}
              style={styles.image_gif}
            />
            <Text style={styles.textSale}>Xem {">"}</Text>
          </View>

          <FlatList
            horizontal
            data={productsSale}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardviewProductSale
                product={item}
                onPress={() => router.push(`/product_screen?id=${item.id}`)}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.divider} />

        {/* SẢN PHẨM ĐỀ XUẤT */}
        <View style={styles.saleHeader}>
          <Text style={styles.textDexuat}>Đề xuất</Text>
          <Text style={styles.textSale}>Xem {">"}</Text>
        </View>

        <FlatList
          data={productsSuggest}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <CardviewProductSuggest
              product={{
                ...item,
                price: item.price,
                priceSale: item.priceSale > 0 ? item.priceSale : 0,
              }}
              onPress={() => router.push(`/product_screen?id=${item.id}`)}
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
    backgroundColor: "#fff",
    paddingBottom: 60,
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
    resizeMode: "cover",
  },
  image_gif: {
    width: "25%",
    aspectRatio: 6 / 3,
    resizeMode: "contain",
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
    marginBottom: 5,
  },
  textDexuat: {
    textAlign: "left",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#Ff8000",
  },
  textSale: {
    textAlign: "right",
    marginRight: 30,
    color: "#Ff8000",
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
});