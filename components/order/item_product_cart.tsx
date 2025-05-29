// src/components/order/item_product_cart.tsx
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Put_update_quantily_cart } from "../../api";

const { width } = Dimensions.get("window");

export interface Cart {
  productId: string;
  name: string;
  firstImage: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  onPress: () => void;
  onImagePress?: () => void;
  onIncrement?: (newQuantity: number) => void;
  onDecrement?: (newQuantity: number) => void;
  selected?: boolean;
}

const ItemProductCart: React.FC<Cart> = ({
  productId,
  name,
  firstImage,
  color,
  size,
  quantity,
  price,
  onPress,
  onImagePress,
  onIncrement,
  onDecrement,
  selected = false,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);

  // Đồng bộ khi prop quantity thay đổi
  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  // Gọi API để cập nhật quantity
  const updateServerQuantity = async (newQty: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Bạn cần đăng nhập");
      const res = await fetch(BASE_URL + Put_update_quantily_cart, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          color,
          size,
          quantity: newQty,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }
    } catch (e: any) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  const handleIncrement = () => {
    const newQty = currentQuantity + 1;
    setCurrentQuantity(newQty);
    updateServerQuantity(newQty);
    onIncrement?.(newQty);
  };

  const handleDecrement = () => {
    if (currentQuantity <= 1) return;
    const newQty = currentQuantity - 1;
    setCurrentQuantity(newQty);
    updateServerQuantity(newQty);
    onDecrement?.(newQty);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Select Indicator */}
      <View style={styles.selectIndicator}>
        <AntDesign
          name={selected ? "checksquare" : "checksquareo"}
          size={20}
          color="rgb(0, 200, 255)"
        />
      </View>

      {/* Ảnh sản phẩm */}
      <View style={styles.imageContainer}>
        {firstImage !== "" && (
          <TouchableOpacity activeOpacity={0.8} onPress={onImagePress}>
            <Image
              source={{ uri: firstImage }}
              style={styles.image}
              contentFit="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.detail}>{color}</Text>
          <Text style={[styles.detail, styles.size]}>{size}</Text>
        </View>
        <Text style={styles.price}>
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          })}
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{currentQuantity}</Text>
          <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 8,
  },
  selectIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 100,
    backgroundColor: "#fff",
    borderRadius: 3,
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
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  size: {
    marginLeft: 8,
  },
  price: {
    fontSize: 16,
    color: "rgba(255, 0, 0,0.8)",
    fontWeight: "bold",
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    color: "#333",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: "#333",
  },
});

export default ItemProductCart;
