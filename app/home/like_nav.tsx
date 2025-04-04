import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Image } from 'expo-image';  // Import expo-image

import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import FixedHeader from "@/components/custom/FixedHeader";

interface Product {
  id: string;
  name: string;
  price: number;     // Giá gốc
  priceSale: number; // Giá sale
  image: { uri: string };
}

const products: Product[] = [
  { id: "1", name: "Áo Khoác Phao", price: 1000000, priceSale: 9000000, image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "2", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/ao-thi-dau-doi-tuyen-viet-nam-2023-grand-sport-38977-do-2-1669090485180.jpg" } },
  { id: "3", name: "Áo Khoác Phao", price: 1000000, priceSale: 0, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },
  { id: "4", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/415/445/products/0e29415e-0f1b-44b2-85ce-e810ef4cff83.jpg" } },
  { id: "5", name: "Áo Khoác Phao", price: 1000000, priceSale: 900000, image: { uri: "https://bizweb.dktcdn.net/100/348/425/products/z3956140470110-a0d2688114c26356d571cd7202460152.jpg?v=1672302848407" } },
];

export default function LikeScreen() {
  return (
    <View style={styles.container}>
      <FixedHeader />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn đã thích</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
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
    paddingBottom: 40,
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
    textAlign: "left",
    color: "#FF8000"
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});