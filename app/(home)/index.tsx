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
import { Image } from "expo-image";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";

// Định nghĩa kiểu cho product (phân biệt giữa Suggest và Sale)
interface ProductSuggest {
  id: string;
  name: string;
  price: string; // Chỉ dùng một giá cho sản phẩm gợi ý
  image: ImageSourcePropType;
}

interface ProductSale {
  id: string;
  name: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  image: ImageSourcePropType;
}

const productsSuggest: ProductSuggest[] = [
  {
    id: "1",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "2",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "3",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "4",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "5",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "6",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "7",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "8",
    name: "Áo Khoác Phao",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
];

const productsSale: ProductSale[] = [
  {
    id: "1",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "2",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "3",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "4",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "5",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "6",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "7",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "8",
    name: "Áo Khoác Phao",
    oldPrice: "1.250.000 VND",
    newPrice: "1.000.000 VND",
    discount: "20%",
    image: require("../../assets/images/aotest.png"),
  },
];

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width;
  const [selectedCategory, setSelectedCategory] = useState<string>("Đề xuất");
  const categories: string[] = ["Đề xuất", "Quần bò", "Áo thun", "Quần jeans"];

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm cố định */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm sản phẩm"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.cartContainer}>
            <Ionicons name="cart-outline" size={24} color="black" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <Image
          source={require("../../assets/images/banner.png")}
          style={styles.image_Banner}
        />

        {/* Danh sách sản phẩm giảm giá sử dụng CardviewProductSale */}
        <View style={styles.saleSection}>
          <Image
            source={require("../../assets/images/sale_img.gif")}
            style={styles.image_gif}
          />
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

        {/* Sản phẩm gợi ý sử dụng CardviewProductSuggest */}
        <FlatList
          data={productsSuggest}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <CardviewProductSuggest
              product={item}
              onPress={() => console.log(`Pressed on ${item.name}`)}
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
  },
  fixedHeader: {
    backgroundColor: "#fff",
    zIndex: 1,
    marginTop: 30,
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
    margin: 20,
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
});