import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageBackground,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

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
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product_screen?idp=${encodeURIComponent(product.id)}`);
  };

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
        <ImageBackground
          source={require("@/assets/images/bg_sale_img.png")}
          style={styles.discountBadge}
          resizeMode="cover"
        >
          <Text style={styles.discountText}>-{product.discount}</Text>
        </ImageBackground>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.newPrice}>
          {product.newPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>

        <Text
          style={styles.oldPrice}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.oldPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: screenWidth * 0.45,
    marginVertical: 8,
    marginHorizontal: 6,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    right: 5,
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
  name: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    minHeight: 38,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  newPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF4D00",
  },
  oldPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
    flexShrink: 1,
    maxWidth: screenWidth * 0.25,
  },
});

export default ItemProductSale;