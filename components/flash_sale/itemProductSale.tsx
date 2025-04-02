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

// Lấy chiều rộng màn hình
const screenWidth = Dimensions.get('window').width;

interface Product {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  image: ImageSourcePropType;
}

interface ItemProductSale {
  product: Product;
}

const ItemProductSale: React.FC<ItemProductSale> = ({ product }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.cardImage} />
        <ImageBackground
          source={require("../../assets/images/bg_sale_img.png")}
          style={styles.discountBadge}
          resizeMode="cover"
        >
          <Text style={styles.discountText}>-{product.discount}</Text>
        </ImageBackground>
      </View>

      <Text
        style={[styles.cardName, { padding: 3, width: screenWidth * 0.3 }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {product.name}
      </Text>

      {/* View chứa giá cũ và giá mới, căn chúng xuống dưới */}
      <View style={styles.priceContainer}>
        <View style={styles.oldPriceContainer}>
          <Text style={styles.oldPrice}>
            {/* Định dạng và thêm "VND" */}
            {product.oldPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        <Text style={styles.cardPrice}>
          {/* Định dạng và thêm "VND" */}
          {product.newPrice.toLocaleString("vi-VN", {
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
    backgroundColor: "#fff",
    width: screenWidth * 0.45,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    margin: 3,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: screenWidth * 0.45,
    height: 150,
    marginBottom: 5,
    borderRadius: 8,
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 40,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "500",
    alignSelf: "flex-start",
    flexWrap: "wrap",
    minHeight: 40,
  },
  priceContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingLeft: 5,
  },
  oldPriceContainer: {
    flexDirection: "row-reverse",
    width: screenWidth * 0.3,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  oldPrice: {
    color: "#888",
    fontSize: 10,
    textDecorationLine: "line-through",
    marginRight: 5,
    textAlign: "right",
  },
  cardPrice: {
    color: "#ff8000",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ItemProductSale;
