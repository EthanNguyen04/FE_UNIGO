import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get("window");

interface ProductInfoProps {
  productName: string;      // Tên sản phẩm
  priceText: number;        // Giá chính
  priceDiscount: number;    // Giá gốc (đã giảm)
  evaluate: number;         // Điểm đánh giá
  sold: number;             // Số lượng đã bán
  inStock: number;          // Số lượng tồn kho
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(1); // Lấy 1 số thập phân
    return `${millions}m`;
  } else if (value >= 1_000) {
    const thousands = (value / 1_000).toFixed(1);   // Lấy 1 số thập phân
    return `${thousands}k`;
  } else {
    // Nếu nhỏ hơn 1.000, trả về dạng nguyên gốc
    return value.toString();
  }
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  priceText,
  priceDiscount,
  evaluate,
  sold,
  inStock,
}) => {

  
  return (
    <View style={styles.product_info}>
      <Text style={styles.product_name}>{productName}</Text>
      
      <View style={styles.priceContainer}>
        <View style={styles.priceText}>
          <Text style={styles.price_text}>
            {priceText.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
          <Text style={styles.price_discount}>
            {priceDiscount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          </Text>
        </View>
        <Text style={styles.evaluate}>
          {evaluate} <AntDesign name="star" size={15} color="gold" />
        </Text>
      </View>

       {/* Dòng "Đã bán ..." */}
      <View style={styles.row}>
        <Text style={styles.label}>Đã bán: </Text>
        <Text style={styles.value}>{formatNumber(sold)}</Text>
      </View>

      {/* Dòng "Tồn kho" */}
      <View style={styles.row}>
        <Text style={styles.label}>Tồn kho: </Text>
        <Text style={styles.value}>{formatNumber(inStock)}</Text>
      </View>

      <View style={styles.info_descripton} />
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  product_info: {
    margin: 15,
  },
  product_name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  priceContainer: {
    width: width*0.9,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  priceText:{
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },
  price_text: {
    color: "#ff8000",
    fontWeight: "bold",
    marginRight: 10,
    fontSize: 20,
  },
  price_discount: {
    textDecorationLine: "line-through",
    color: "rgba(189, 189, 189, 1)",
    fontSize: 12,
    marginRight: 10,
  },
  evaluate: {
    width: "50%",
    fontSize: width * 0.036,
    color: '#000',
    textAlign: 'right', // Căn dòng chữ sang phải
  },
  // Tách hai dòng "Đã bán" và "Tồn kho"
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Đưa toàn bộ nội dung sang bên phải
    marginBottom: 5,
  },
  label: {
    fontSize: width * 0.03,
    color: '#616161',
    // Tạo khoảng cách giữa label và value, nếu cần
    marginRight: 4,
  },
  value: {
    fontSize: width * 0.03,
    color: '#616161',
    fontWeight: 'bold',
    // Nếu muốn bản thân value cũng căn chữ sang phải:
    // textAlign: 'right',
  },
  info_descripton: {
    borderWidth: 0.5,
    width: "95%",
    marginTop: 10,
    borderColor: "rgba(210, 213, 219, 0.94)",
  },
});
