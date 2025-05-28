import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Im_URL } from "../../api"; // Import BASE_URL

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get("window").width;

interface Product {
  id: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
  image: ImageSourcePropType;
}

interface CardviewProductSaleProps {
  product: Product;
}

const CardviewProductSale: React.FC<CardviewProductSaleProps> = ({ product }) => {
  // Giả sử product.image được truyền dưới dạng { uri: item.link }
  // Ta nối BASE_URL với uri của product.image
  const imageSource = { uri: Im_URL + (product.image as { uri: string }).uri };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.cardImage} />
        <ImageBackground
          source={require("../../assets/images/bg_sale_img.png")}
          style={styles.discountBadge}
          resizeMode="cover"
        >
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </ImageBackground>
      </View>

      <Text
        style={[styles.cardName, { padding: 3, width: screenWidth * 0.3 }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {product.name}
      </Text>

      <View style={styles.priceContainer}>
        <View style={styles.oldPriceContainer}>
          <Text style={styles.oldPrice}>
            {product.original_price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        <Text style={styles.cardPrice}>
          {product.discount_price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    width: screenWidth * 0.3,
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    margin: 2,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 2,
    overflow: "hidden",
    margin: 4,
  },
  cardImage: {
    width: screenWidth * 0.3 - 8,
    height: 120,
    marginBottom: 5,
    borderRadius: 12,
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 4,
    right: 8,
    width: 39,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "600",
    alignSelf: "flex-start",
    flexWrap: "wrap",
    minHeight: 40,
    color: "#1a1a1a",
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  priceContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
  },
  oldPriceContainer: {
    width: screenWidth * 0.3,
    justifyContent: "space-between",
    paddingRight: 12,
    marginBottom: 4,
  },
  oldPrice: {
    color: "#999999",
    fontSize: 11,
    textDecorationLine: "line-through",
    textAlign: "left",
    fontWeight: "500",
    opacity: 0.8,
  },
  cardPrice: {
    color: "#FF3030",
    fontSize: 16,
    fontWeight: "700",
    textShadowColor: "rgba(255,48,48,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
});

export default CardviewProductSale;