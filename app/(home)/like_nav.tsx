import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";

interface Product {
  id: string;
  name: string;
  price: string;
  image: ImageSourcePropType;
}

const products: Product[] = [
  {
    id: "1",
    name: "Áo thun cổ tròn màu đen",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "2",
    name: "Áo thun cổ tròn màu đen",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "3",
    name: "Áo thun cổ tròn màu đen",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
  {
    id: "4",
    name: "Áo thun cổ tròn màu đen",
    price: "1.000.000 VND",
    image: require("../../assets/images/aotest.png"),
  },
];

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
              placeholder="Tìm sản phẩm đã thích"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
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

      {/* Nội dung */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn đã thích</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  fixedHeader: {
    backgroundColor: "#fff",
    zIndex: 1,
    marginTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5, // Đồng bộ với HomeScreen
    paddingTop: 10, // Đồng bộ với HomeScreen
    paddingBottom: 20, // Đồng bộ với HomeScreen
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});