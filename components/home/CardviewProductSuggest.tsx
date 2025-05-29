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
    <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.cardImage} />
          <View style={styles.imageOverlay} />
        </View>

        {/* Tên sản phẩm (tối đa 2 dòng) */}
        <View style={styles.contentSection}>
          <Text style={[styles.cardName, { minHeight: 40, lineHeight: 20 }]} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Vùng hiển thị giá (luôn luôn 2 dòng) */}
          <View style={styles.priceArea}>
            {/* Chỉ hiển thị giá cũ nếu có sale */}
            <Text
              style={[
                styles.cardPriceOriginal,
                { opacity: showOldPrice ? 1 : 0 },
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(85, 85, 85, 0.46)",
    borderRadius: 10,
    // margin: 2,
    width: screenWidth * 0.45,
    // Elegant shadow
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    // Clean border
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  
  imageWrapper: {
    position: "relative",
    backgroundColor: "#f8f9fa",
  },
  
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  
  contentSection: {
    padding: 14,
    backgroundColor: "#ffffff",
  },

  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
    textAlign: "left",
    marginBottom: 8,
    fontFamily: "System",
  },

  /* Vùng giá */
  priceArea: {
    minHeight: 42,
    justifyContent: "flex-end",
  },

  /* Dòng giá cũ */
  cardPriceOriginal: {
    color: "#a0aec0",
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "line-through",
    marginBottom: 2,
    fontFamily: "System",
  },

  /* Dòng giá sale */
  cardPriceSale: {
    color: "#e53e3e",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "System",
  },

  /* Dòng giá bình thường */
  cardPrice: {
    color: "#f56500",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "System",
  },
});

export default CardviewProductSuggest;