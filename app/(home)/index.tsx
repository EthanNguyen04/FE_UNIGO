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
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image"; // Sử dụng expo-image cho việc load ảnh từ URL
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

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
  { id: "1", name: "Áo Khoác Phao Khoác Phao Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: require("../../assets/images/aotest.png") },
  { id: "2", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://vulcano.sgp1.digitaloceanspaces.com/media/15404/conversions/ao-thun-1001-vulcano01-card_preview.webp" } },
  { id: "3", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphucpanda.com/wp-content/uploads/2024/09/947-ao-lop-polo-mix-co-v-bst-cool-ngau-ca-tinh-mau-xi-mang-1.jpg" } },
  { id: "4", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "5", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: require("../../assets/images/aotest.png") },
  { id: "6", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: require("../../assets/images/aotest.png") },
  { id: "7", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: require("../../assets/images/aotest.png") },
  { id: "8", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: require("../../assets/images/aotest.png") },
];

const icons = {
  cart: require("../../assets/images/cart_img.png"),
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Đề xuất");
  const categories: string[] = ["Đề xuất", "Quần bò", "Áo thun", "Quần jeans"];

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm cố định */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Tìm sản phẩm" placeholderTextColor="#888" />
          </View>
          <TouchableOpacity style={styles.cartIconContainer}>
            <View style={styles.iconBackground}>
              <Image source={icons.cart} style={styles.ic_cart} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image source={require("../../assets/images/banner.png")} style={styles.image_Banner} />

        {/* Danh sách sản phẩm giảm giá */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Image source={require("../../assets/images/sale_img.gif")} style={styles.image_gif} />
            <Text style={styles.textSale}>xem</Text>
          </View>

          
          <FlatList
            horizontal
            data={productsSale}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardviewProductSale product={item} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Danh mục */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category} style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]} onPress={() => setSelectedCategory(category)}>
              <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>{category}</Text>
            </TouchableOpacity>
          ))}
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
  fixedHeader: {
    backgroundColor: "#fff",
    zIndex: 1,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  cartContainer: {
    position: "relative",
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
    resizeMode: "contain",
    aspectRatio: 10 / 3,
  },
  image_gif: {
    width: "25%",
    aspectRatio: 6 / 3,
    resizeMode: "contain",
  },
  saleSection: {
    marginBottom: 10,
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
  cartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 50, // Kích thước nền tròn
    height: 50,
    borderRadius: 50, // Làm tròn viền (bằng 1/2 width & height)
    backgroundColor: "#EEEDED", // Màu nền (đổi theo UI của bạn)
    justifyContent: "center",
    alignItems: "center",
  },
  
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0", // Màu nền cam nhạt
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    alignItems: "center",
  },
  ic_cart: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  saleHeader:{
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",  // Căn giữa các phần tử theo chiều dọc

  },
  textSale:{
    textAlign: "right",
    marginRight: 30,
    color: "#ff8000",
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",  // Đảm bảo văn bản căn giữa theo chiều dọc với các phần tử còn lại
  }
});
