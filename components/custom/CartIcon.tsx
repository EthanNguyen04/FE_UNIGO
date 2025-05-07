import { Image } from "expo-image";
import React, { useState, useCallback } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Get_count_cart } from "../../api";

const icons = {
  cart: require("../../assets/images/cart_img.png"),
};

const CartIcon = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(0);
  const [userType, setUserType] = useState<string>("khach");

  // Hàm fetch count
  const fetchCartCount = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}${Get_count_cart}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setCartCount(data.total_products);
    } catch {
      // nếu cần, bạn có thể setCartCount(0) hoặc giữ nguyên
    }
  }, []);

  // Khi màn hình focus, load userType + count
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const type = await AsyncStorage.getItem("type");
        if (!isActive) return;
        setUserType(type || "khach");

        if (type && type !== "khach") {
          await fetchCartCount();
        } else {
          setCartCount(0);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [fetchCartCount])
  );

  const handlePress = () => {
    if (userType === "khach") {
      router.push("/login");
    } else {
      router.push("/cart_screen");
    }
  };

  return (
    <TouchableOpacity style={styles.cartIconContainer} onPress={handlePress}>
      <View style={styles.iconBackground}>
        {userType === "khach" ? (
          <Text style={styles.loginText}>Đăng nhập</Text>
        ) : (
          <Image source={icons.cart} style={styles.ic_cart} contentFit="contain" />
        )}
      </View>
      {userType !== "khach" && cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#EEEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  ic_cart: {
    width: 30,
    height: 30,
  },
  loginText: {
    fontSize: 12,
    color: "#FF8000",
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default CartIcon;
