import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  Platform,
  ToastAndroid,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Post_CheckLike, Post_ChangeLike } from "../../api";

const { width } = Dimensions.get("window");

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Hàm kiểm tra trạng thái wishlist ban đầu
  const checkWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Vui lòng đăng nhập");
        return;
      }
      const response = await fetch(`${BASE_URL}${Post_CheckLike}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      console.log("Wishlist response:", data);
      if (response.ok) {
        setIsFavorite(data.inWishlist);
      } else {
        console.log("Lỗi kiểm tra wishlist:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  useEffect(() => {
    checkWishlist();
  }, [productId]);

  // Hàm xử lý thay đổi trạng thái wishlist qua API
  const handleToggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        ToastAndroid.show("Vui lòng đăng nhập", ToastAndroid.SHORT);
        return;
      }
      const response = await fetch(`${BASE_URL}${Post_ChangeLike}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      console.log("Toggle wishlist response:", data);
      if (response.ok) {
        if (data.message && data.message.includes("Thêm sản phẩm vào danh sách yêu thích thành công")) {
          setIsFavorite(true);
          if (Platform.OS === "android") {
            ToastAndroid.show("Đã thêm vào danh sách yêu thích!", ToastAndroid.SHORT);
          }
        } else if (data.message && data.message.includes("Xóa sản phẩm khỏi danh sách yêu thích thành công")) {
          setIsFavorite(false);
          if (Platform.OS === "android") {
            ToastAndroid.show("Đã xóa khỏi danh sách yêu thích!", ToastAndroid.SHORT);
          }
        }
      } else {
        console.log("Lỗi toggle wishlist:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error changing like status:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.favorite} onPress={handleToggleFavorite}>
      <AntDesign name="heart" size={20} color={isFavorite ? "red" : "gray"} />
      <Text style={styles.text}>{isFavorite ? "Yêu thích" : "Thêm vào \n Yêu thích"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favorite: {
    width: width * 0.2,
    alignItems: "center",
    paddingLeft: 5,
  },
  text: {
    marginLeft: width * 0.02,
    fontSize: width * 0.025,
    color: "#000",
  },
});

export default FavoriteButton;
