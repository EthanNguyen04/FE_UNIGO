import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";


const products = [
  { id: "1", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "2", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "3", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "4", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "5", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "6", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "7", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "8", name: "Áo Khoác Phao", oldPrice: "1.250.000 VND", newPrice: "1.000.000 VND", discount: "20%", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
];

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width; // Lấy chiều rộng màn hình

  const [selectedCategory, setSelectedCategory] = useState("Đề xuất");
  const categories = ["Đề xuất", "Quần bò", "Áo thun", "Quần jeans"];

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Tìm sản phẩm" />
        <TouchableOpacity>
          <Ionicons name="cart" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Image
        source={require("../../assets/images/banner.png")}
        style={styles.image_Banner} 
      />

      {/* Danh sách sản phẩm giảm giá */}
      <View style={styles.saleSection}>
        <Image 
          source={require("../../assets/images/sale_img.gif")}
          style={styles.image_gif}
        />
        <FlatList
          horizontal
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.discountBadge}>{item.discount}</Text>
              </View>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                <Text style={styles.newPrice}>{item.newPrice}</Text>
              </View>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Danh mục */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sản phẩm gợi ý */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.suggestedProduct}>
              <Image source={{ uri: item.image }} style={styles.suggestedImage} />
              <Text style={styles.suggestedName}>{item.name}</Text>
              <Text style={styles.suggestedPrice}>{item.newPrice}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft:5,
    paddingRight:5,
  },
  image_Banner: {
    width: "100%", // Vừa với màn hình
    alignSelf: "center", // Chỉ căn giữa theo chiều ngang
    resizeMode: "contain", // Giữ nguyên tỷ lệ ảnh
    margin: 20,
    aspectRatio: 10 / 3, // Tự động tính chiều cao dựa trên tỷ lệ
  },
  image_gif: {
    width: "25%", // Vừa màn hình
    aspectRatio: 6 / 3, // Tự động tính chiều cao dựa trên tỷ lệ
    resizeMode: "contain",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  banner: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerSale: {
    color: "#ff0",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  saleSection: {
    marginBottom: 10,
  },
  saleLabel: {
    backgroundColor: "#ff0000",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  productItem: {
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 5,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  priceContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  oldPrice: {
    color: "#888",
    fontSize: 8,
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  newPrice: {
    color: "#ff0000",
    fontSize: 8,
    fontWeight: "bold",
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#ff0000",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
    borderRadius: 4,
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
    borderRadius: 8,
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
  suggestedProduct: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestedImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  suggestedName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
    width: "100%",
  },
  suggestedPrice: {
    color: "#e60000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginTop: 5,
  },
});