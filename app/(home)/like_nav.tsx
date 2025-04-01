import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";

interface Product {
  id: string;
  name: string;
  price: number;     // Giá gốc
  priceSale: number; // Giá sale
  image: ImageSourcePropType;
}

const products: Product[] = [
  { id: "1", name: "Áo Khoác Phao", price: 1000000, priceSale: 9000000, image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "2", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/ao-thi-dau-doi-tuyen-viet-nam-2023-grand-sport-38977-do-2-1669090485180.jpg" } },
  { id: "3", name: "Áo Khoác Phao", price: 1000000, priceSale: 0, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },  // Example image URL
  { id: "4", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },  // Example image URL
  { id: "5", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/100/348/425/products/z3956140470110-a0d2688114c26356d571cd7202460152.jpg?v=1672302848407" } },  // Example image URL
  // Thêm các sản phẩm khác
];

const icons = {
  cart: require("../../assets/images/cart_img.png"),
};

export default function LikeScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Biểu tượng giỏ hàng */}
          <TouchableOpacity style={styles.cartIconContainer}>
            <View style={styles.iconBackground}>
              <Image source={icons.cart} style={styles.icon_cart} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn đã thích</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper} // Áp dụng style cho mỗi hàng 2 item
          renderItem={({ item }) => (
            <CardviewProductSuggest
              product={item}
              onPress={() => console.log(`Pressed on ${item.name}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 40,
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
    textAlign: "left", // Căn giữa tiêu đề
    color: "#FF8000"
  },
  // Biểu tượng giỏ hàng
  cartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#EEEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  icon_cart: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: 0,
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
  columnWrapper: {
    justifyContent: "space-between", // Trải đều item theo chiều ngang
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
});
