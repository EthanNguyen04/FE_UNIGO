import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentProps {
  onPress: () => void;
  discountCode?: string; // Nếu có mã giảm giá được chọn thì hiển thị, không có thì hiển thị placeholder
}

const PaymentSelector: React.FC<PaymentProps> = ({ onPress, discountCode }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>
        {discountCode ? discountCode : "Phương thức thanh toán"}
      </Text>
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

export default PaymentSelector;
