import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export interface Order {
  product_id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

const ItemProductOrder: React.FC<Order> = ({
  product_id,
  name,
  image,
  color,
  size,
  quantity,
  price, // truyền giá vào
}) => {
  // Định dạng giá theo tiền Việt Nam
  const formattedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
  
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.detail}>Size: {size}</Text>
          <Text style={[styles.detail, styles.detailMargin]}>Màu: {color}</Text>
        </View>
        <Text style={styles.quantity}>Số lượng: {quantity}</Text>
        <Text style={styles.priceText}>Giá: {formattedPrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  details: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  detailMargin: {
    marginLeft: 8,
  },
  quantity: {
    fontSize: 14,
    color: "#333",
  },
  priceText: {
    fontSize: 14,
    color: "#FF6600",
    fontWeight: "bold",
  },
});

export default ItemProductOrder;
