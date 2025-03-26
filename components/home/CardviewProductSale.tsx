import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
} from "react-native";

// Định nghĩa kiểu cho product
interface Product {
  id: string;
  name: string;
  oldPrice: string;
  newPrice: string;
  discount: string;
  image: ImageSourcePropType;
}

// Định nghĩa kiểu cho props
interface CardviewProductSaleProps {
  product: Product;
}

const CardviewProductSale: React.FC<CardviewProductSaleProps> = ({ product }) => {
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
      <Text style={[styles.cardName, { marginLeft: 3 }]}>{product.name}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: "bold", marginLeft: 3, marginRight: 8 }}>
          Giá gốc
        </Text>
        <Text style={styles.oldPrice}>{product.oldPrice}</Text>
      </View>
      <Text style={[styles.cardPrice, { marginLeft: 2, marginTop: 1 }]}>
        {product.newPrice}
      </Text>
    </View>
  );
};

// Styles cho CardviewProductSale
const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: 120,
    height: 120,
    marginBottom: 5,
    borderRadius: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  oldPrice: {
    color: "#888",
    fontSize: 8,
    textDecorationLine: "line-through",
    marginRight: 5,
  },
  cardPrice: {
    color: "#ff0000",
    fontSize: 13,
    fontWeight: "bold",
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
});

export default CardviewProductSale;