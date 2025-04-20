import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

// Mở rộng interface Cart để thêm prop selected và các callback tăng/giảm số lượng (nếu cần)
export interface Cart {
  productId: string;
  name: string;
  firstImage: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  onPress: () => void;
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
  onIncrement,
  onDecrement,
  selected = false,
}) => {
  // Sử dụng state nội bộ để quản lý số lượng
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);

  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    if (onIncrement) {
      onIncrement(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (currentQuantity <= 1) return;
    const newQuantity = currentQuantity - 1;
    setCurrentQuantity(newQuantity);
    if (onDecrement) {
      onDecrement(newQuantity);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        {/* Ô select (nổi lên trên tất cả) ở góc trên bên phải */}
        <View style={styles.selectIndicator}>
          <AntDesign 
            name={selected ? "checksquare" : "checksquareo"} 
            size={20} 
            color="#FF6600" 
          />
        </View>
      <View style={styles.imageContainer}>
        {firstImage !== "" && (
          <Image source={{ uri: firstImage }} style={styles.image} contentFit="cover" />
        )}

      </View>
      <View style={styles.details}>
        {/* Dòng tên sản phẩm chỉ 1 dòng, nếu dài sẽ bị cắt và hiển thị dấu "..." */}
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        {/* Hiển thị màu và kích cỡ trên cùng một dòng */}
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
        {/* Layout tăng giảm số lượng */}
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
    right: 5, // Đặt ở góc trên bên trái, thay đổi thành right nếu muốn ở góc trên bên phải
    zIndex: 100, // Đảm bảo nổi lên trên tất cả
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
    color: "#FF6600",
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
