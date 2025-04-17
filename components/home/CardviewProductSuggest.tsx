import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { Im_URL } from "../../api"; // Import BASE_URL

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get("window").width;

interface Product {
  id: string;
  name: string;
  original_price: number; // Giá cũ
  discount_price: number; // Giá giảm
  discount: number; // Phần trăm giảm giá
  image: ImageSourcePropType; // Hình ảnh sản phẩm
}

interface CardviewProductSuggestProps {
  product: Product;
  onPress: () => void;
}

const CardviewProductSuggest: React.FC<CardviewProductSuggestProps> = ({
  product,
  onPress,
}) => {
  // Chuyển đổi giá thành chuỗi hiển thị
  const oldPriceText = product.original_price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const salePriceText = product.discount_price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Nếu không có sale (discount_price = 0) thì dòng trên sẽ để trống
  const showOldPrice = product.original_price > 0 ? oldPriceText : "";

  // Nếu không có sale (discount_price = 0) thì dòng dưới là giá bình thường
  // nếu có sale thì dòng dưới là giá sale
  const showNewPrice =
    product.discount_price > 0 ? salePriceText : oldPriceText;

  const imageSource = { uri: Im_URL + (product.image as { uri: string }).uri };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Image source={imageSource} style={styles.cardImage} />

        {/* Tên sản phẩm (tối đa 2 dòng) */}
        <Text style={[styles.cardName, { minHeight: 40, lineHeight: 20 }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Vùng hiển thị giá (luôn luôn 2 dòng) */}
        <View style={styles.priceArea}>
          {/* Chỉ hiển thị giá cũ nếu có sale */}
          <Text
            style={[
              styles.cardPriceOriginal,
              { opacity: showOldPrice ? 1 : 0 }, // Ẩn giá cũ nếu không có sale
            ]}
          >
            {showOldPrice}
          </Text>

          <Text
            style={
              product.discount_price > 0 ? styles.cardPriceSale : styles.cardPrice
            }
          >
            {showNewPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 5,
    width: screenWidth * 0.45,
    // Hiệu ứng nổi (shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
    height: 200,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
    marginLeft: 10,
    marginRight: 10,
  },

  /* Luôn để 2 dòng giá ở đây */
  priceArea: {
    minHeight: 50, // Đảm bảo chiều cao cho 2 dòng, bất kể có sale hay không
    justifyContent: "space-between",
  },

  /* Dòng giá cũ */
  cardPriceOriginal: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "line-through",
    marginLeft: 10,
    marginRight: 10,
    // Không hiển thị khi không có sale
    opacity: 0, 
  },

  /* Dòng giá sale */
  cardPriceSale: {
    color: "#FF8000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
    textAlign: "right",
  },

  /* Dòng giá bình thường (khi không có sale) */
  cardPrice: {
    color: "#FF8000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
    textAlign: "right",
  },
});

export default CardviewProductSuggest;
