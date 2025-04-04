import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Dimensions,
  TouchableOpacity, // <- THÊM DÒNG NÀY
} from "react-native";

const screenWidth = Dimensions.get('window').width;

interface Product {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  image: ImageSourcePropType;
}

interface CardviewProductSaleProps {
  product: Product;
  onPress?: () => void; // <- THÊM PROPS onPress
}

const CardviewProductSale: React.FC<CardviewProductSaleProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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

      <View style={styles.priceContainer}>
        <View style={styles.oldPriceContainer}>
          <Text style={styles.oldPrice}>
            {product.oldPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>
        <Text style={styles.cardPrice}>
          {product.newPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: screenWidth * 0.35,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    margin: 3,
    marginRight: 15,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: screenWidth * 0.35,
    height: 130,
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

export default CardviewProductSale;