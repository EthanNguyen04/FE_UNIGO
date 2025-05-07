// ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Updates from "expo-updates";       // ← thêm vào

import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

import LogoutDialog from "../../components/home/LogoutDialog";
import CartIcon from "@/components/custom/CartIcon";
import OrderProfileComponent from "@/components/home/profile/oderComponent";
import SettingComponent from "@/components/home/profile/settingComponent";

import {
  BASE_URL,
  Get_info_user,
  LOGIN_api,
  Im_URL,
  LOGOUT_api,
} from "../../api";

export default function ProfileScreen() {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar_url: "",
    order_count: 0,
    wishlist_count: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const router = useRouter();

  // 1) Kiểm tra token lần đầu
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const resp = await fetch(`${BASE_URL}${LOGIN_api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          setIsLoggedIn(resp.status === 200);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  // 2) Fetch user info
  const fetchUserInfo = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${BASE_URL}${Get_info_user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      setUserInfo({
        username: data.name,
        avatar_url: data.avatar_url?.trim()
          ? `${Im_URL}${data.avatar_url}`
          : require("../../assets/images/avatar.png"),
        order_count: data.order_count,
        wishlist_count: data.wishlist_count,
      });
    } catch {
      // ignore
    } finally {
      setAvatarLoading(false);
    }
  }, []);

  // 3) Khi focus lại màn hình
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        setAvatarLoading(true);
        fetchUserInfo();
      }
    }, [isLoggedIn, fetchUserInfo])
  );

  // 4) Loading state
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8000" />
      </View>
    );
  }

  // 5) Nếu chưa login
  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.authButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.authButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 6) Hàm gọi API logout
  const handleLogoutConfirm = async () => {
    setLogoutVisible(false);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token");

      // Gọi API logout
      const res = await fetch(`${BASE_URL}${LOGOUT_api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Lỗi", data.message || "Đăng xuất thất bại");
        return;
      }

      // Lấy tất cả keys, chỉ giữ lại "InApp"
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key => key !== "InApp");
      if (keysToRemove.length) {
        await AsyncStorage.multiRemove(keysToRemove);
      }

      // Reload lại app
      await Updates.reloadAsync();

    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Có lỗi xảy ra");
    }
  };
  // 7) UI khi đã login
  const { username, avatar_url, order_count, wishlist_count } = userInfo;
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              typeof avatar_url === "string"
                ? { uri: avatar_url }
                : avatar_url
            }
            style={styles.avatar}
            contentFit="cover"
            onLoadStart={() => setAvatarLoading(true)}
            onLoadEnd={() => setAvatarLoading(false)}
          />
          {avatarLoading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="small"
              color="#FF8000"
            />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username || "Unknown"}</Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>{order_count} Đã mua</Text>
            <Text style={styles.statText}>{wishlist_count} Được thích</Text>
          </View>
        </View>
        <CartIcon />
      </View>

      {/* Các mục khác */}
      <OrderProfileComponent />
      <SettingComponent />

      {/* Nút mở dialog */}
      <TouchableOpacity
        style={[styles.authButton_logout, { marginTop: 20 }]}
        onPress={() => setLogoutVisible(true)}
      >
        <Text style={styles.authButtonText_logout}>Đăng Xuất</Text>
      </TouchableOpacity>

      {/* Dialog */}
      <LogoutDialog
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogoutConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 15,
  },
  avatar: { width: "100%", height: "100%" },
  activityIndicator: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
  },
  userInfo: { flex: 1 },
  username: {
    fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5,
  },
  stats: { flexDirection: "row" },
  statText: {
    fontSize: 12, color: "#666", marginRight: 15, fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
  },
  authContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 20,
  },
  authButton_logout: {
    backgroundColor: "#AEAEAE", paddingVertical: 5,
    borderRadius: 8, marginHorizontal: 70,
    alignItems: "center"
  },
  authButtonText_logout: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },

  authButton: {
    backgroundColor: "#FF8000", paddingVertical: 12, paddingHorizontal: 30,
    borderRadius: 8, marginBottom: 10,
  },
  authButtonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold",
  },
});
