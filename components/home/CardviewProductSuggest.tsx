import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions, // Thêm import này
} from "react-native";

interface Product {
  id: string;
  name: string;
  price: string;
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
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Image source={product.image} style={styles.cardImage} />
        <Text style={styles.cardName}>{product.name}</Text>
        <Text style={styles.cardPrice}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: Dimensions.get("window").width / 2 - 20, // Sử dụng Dimensions
  },
  cardImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
    width: "100%",
  },
  cardPrice: {
    color: "#e60000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginTop: 5,
  },
});

export default CardviewProductSuggest;