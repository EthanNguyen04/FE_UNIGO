import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface ProductInfoProps {
  productName: string;
  priceText: number;
  priceDiscount: number;
  evaluate: number;
  sold: number;
  inStock: number;

  productName: string;      // Tên sản phẩm
  priceText: number;        // Giá chính
  priceDiscount: number;    // Giá gốc (đã giảm)
  evaluate: number;         // Điểm đánh giá
  sold: number;             // Số lượng đã bán
  inStock: number;          // Số lượng tồn kho
  hidePrice?: boolean;      // Ẩn phần giá

}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  priceText,
  priceDiscount,
  evaluate,

  sold = 0,
  inStock = 0,

  sold = 0,      // nếu undefined => 0
  inStock = 0,   // nếu undefined => 0
  hidePrice = false,
}) => {
  const formatPrice = (price: number) =>
    typeof price === "number" && !isNaN(price)
      ? price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      : "Liên hệ";

  return (
    <View style={styles.container}>
      <Text style={styles.productName} numberOfLines={2}>
        {productName}
      </Text>


      <View style={styles.priceproduct}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(priceText)}</Text>
          {priceDiscount > priceText && (
            <Text style={styles.discount}>{formatPrice(priceDiscount)}</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <AntDesign name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{evaluate.toFixed(1)} / 5</Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statText}>
          Đã bán: <Text style={styles.bold}>{formatNumber(sold)}</Text>
        </Text>
        <Text style={styles.statText}>
          Tồn kho: <Text style={styles.bold}>{formatNumber(inStock)}</Text>
        </Text>
      </View>

      {!hidePrice && (
        <View style={styles.priceContainer}>
          <View style={styles.priceText}>
            <Text style={styles.price_text}>
              {formatPrice(priceText)} {/* Sử dụng formatPrice để kiểm tra giá trị */}
            </Text>
            <Text style={styles.price_discount}>
              {formatPrice(priceDiscount)} {/* Sử dụng formatPrice để kiểm tra giá trị */}
            </Text>
          </View>
          <Text style={styles.evaluate}>
            {evaluate} <AntDesign name="star" size={15} color="gold" />
          </Text>
        </View>
      )}


      <View style={styles.separator} />
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    backgroundColor: "#fff",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  priceproduct:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    color: "#FF5722",
    fontWeight: "bold",
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: "#9E9E9E",
    textDecorationLine: "line-through",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 80,
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: "#616161",
  },
  bold: {
    fontWeight: "600",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
});