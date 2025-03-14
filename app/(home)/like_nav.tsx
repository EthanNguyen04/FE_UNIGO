import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

const products = [
  { id: "1", name: "Áo thun cổ tròn màu đen", price: "1.000.000 VND", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "2", name: "Áo thun cổ tròn màu đen", price: "1.000.000 VND", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "3", name: "Áo thun cổ tròn màu đen", price: "1.000.000 VND", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
  { id: "4", name: "Áo thun cổ tròn màu đen", price: "1.000.000 VND", image: "https://www.lavender.com.vn/wp-content/uploads/chup-anh-ao-dai-truyen-thong-cung-ban-be-o-ha-noi.jpg" },
];

export default function LikeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bạn đã thích</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
    resizeMode: "cover",
    
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  price: {
    fontSize: 14,
    color: "#e60000",
    textAlign: "center",
  },
});