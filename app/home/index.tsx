import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image"; // Sử dụng expo-image cho việc load ảnh từ URL
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import { router } from "expo-router";
import FixedHeader from "@/components/custom/FixedHeader";

const screenWidth = Dimensions.get("window").width;

import { BASE_URL } from '../../api';

console.log('API URL:', BASE_URL); 
// Định nghĩa kiểu cho sản phẩm
interface ProductSuggest {
  id: string;
  name: string;
  price: number;  // Giá gốc
  priceSale: number;  // Giá sale
  image: ImageSourcePropType; // Dùng kiểu cho ImageSourcePropType
}

interface ProductSale {
  id: string;
  name: string;
  oldPrice: number;  // Giá cũ
  newPrice: number;  // Giá mới
  discount: string;
  image: ImageSourcePropType;
}

const productsSuggest: ProductSuggest[] = [
  { id: "1", name: "Áo Khoác Phao", price: 1000000, priceSale: 9000000, image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "2", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/ao-thi-dau-doi-tuyen-viet-nam-2023-grand-sport-38977-do-2-1669090485180.jpg" } },
  { id: "3", name: "Áo Khoác Phao", price: 1000000, priceSale: 0, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },  // Example image URL
  { id: "4", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },  // Example image URL
  { id: "5", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/100/348/425/products/z3956140470110-a0d2688114c26356d571cd7202460152.jpg?v=1672302848407" } },  // Example image URL
  // Thêm các sản phẩm khác
];

const productsSale: ProductSale[] = [
  { id: "1", name: "Áo Khoác Phao Khoác Phao Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "2", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://vulcano.sgp1.digitaloceanspaces.com/media/15404/conversions/ao-thun-1001-vulcano01-card_preview.webp" } },
  { id: "3", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphucpanda.com/wp-content/uploads/2024/09/947-ao-lop-polo-mix-co-v-bst-cool-ngau-ca-tinh-mau-xi-mang-1.jpg" } },
  { id: "4", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "5", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" }},
  { id: "6", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "7", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "8", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
];



export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Đề xuất");

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm cố định */}
      <FixedHeader />

      {/* Nội dung cuộn */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
        {/* Banner */}
        <Image source={require("../../assets/images/banner.png")} contentFit="contain" style={styles.image_Banner} />

        {/* Danh sách sản phẩm giảm giá */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Image source={require("../../assets/images/sale_img.gif")} style={styles.image_gif} contentFit="contain"/>
            <Text style={styles.textSale}>Xem {">"}</Text>
          </View>
          
          <FlatList
            horizontal
            data={productsSale}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardviewProductSale product={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={styles.divider} />

        {/* Danh mục  // không cần thêm gì*/}
        <View style={styles.saleHeader}>
            <Text style={styles.textDexuat}>Đề xuất</Text>
            <Text style={styles.textSale}>Xem {">"}</Text>
        </View>

        {/* Sản phẩm gợi ý */}
        <FlatList
          data={productsSuggest}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <CardviewProductSuggest
              product={{
                ...item,
                price: item.price, // Giá gốc
                priceSale: item.priceSale > 0 ? item.priceSale : 0,
              }}
              onPress={() => {
                // Ví dụ chuyển hướng đến '/product/[id]' với id là item.id
                router.push("/product_screen");
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

// Styles remains the same...
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
    marginBottom: 5,
  },
  textDexuat:{
    textAlign: "left",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#Ff8000"
  },
  textSale: {
    textAlign: "right",
    marginRight: 30,
    color: "#Ff8000"
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  selectedCategoryButton: {
    backgroundColor: "#FF8000",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  divider: {
    width: screenWidth*0.95,   // Chiều rộng thay đổi thành chiều dài
    height: 1,
    backgroundColor: "rgb(202, 202, 202)",
    marginHorizontal: screenWidth * 0.01,
    justifyContent:"center"
  },
});
