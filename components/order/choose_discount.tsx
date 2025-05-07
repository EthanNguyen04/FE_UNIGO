import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DiscountSelectorProps {
  onPress: () => void;
  discountCode?: string;       // Mã giảm giá đã chọn
  discountPercent?: number;    // Phần trăm giảm giá tương ứng
}

const DiscountSelector: React.FC<DiscountSelectorProps> = ({
  onPress,
  discountCode,
  discountPercent,
}) => {
  const displayText =discountCode
    ? `Mã: ${discountCode} - Giảm ${discountPercent ?? 0}%`
    : "Chọn mã giảm giá";

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{displayText}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default DiscountSelector;
