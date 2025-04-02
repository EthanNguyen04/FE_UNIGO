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

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get("window").width;

interface Product {
  id: string;
  name: string;
  price: number;
  priceSale: number;
  image: ImageSourcePropType;
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
  const oldPriceText = product.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const salePriceText = product.priceSale.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Nếu không có sale (priceSale = 0) thì dòng trên sẽ để trống
  const showOldPrice = product.priceSale > 0 ? oldPriceText : "";

  // Nếu không có sale (priceSale = 0) thì dòng dưới là giá bình thường
  // nếu có sale thì dòng dưới là giá sale
  const showNewPrice =
    product.priceSale > 0 ? salePriceText : oldPriceText;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Image source={product.image} style={styles.cardImage} />

        {/* Tên sản phẩm (tối đa 2 dòng) */}
        <Text style={[styles.cardName, { minHeight: 40, lineHeight: 20 }]} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Vùng hiển thị giá (luôn luôn 2 dòng) */}
        <View style={styles.priceArea}>
          <Text style={styles.cardPriceOriginal}>
            {showOldPrice}
          </Text>
          <Text
            style={
              product.priceSale > 0 ? styles.cardPriceSale : styles.cardPrice
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
