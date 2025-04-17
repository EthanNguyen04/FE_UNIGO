import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import LogoutDialog from "../../components/home/LogoutDialog";
import { Image } from "expo-image"; // Sử dụng expo-image
import CartIcon from "@/components/custom/CartIcon";
import { BASE_URL, Get_info_user, LOGIN_api, Im_URL } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderProfileComponent from "@/components/home/profile/oderComponent";
import SettingComponent from "@/components/home/profile/settingComponent";

export default function ProfileScreen() {
  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    username: "",
    avatar_url: "", // Nếu API không trả về, dùng avatar mặc định
    order_count: 0,
    wishlist_count: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = trạng thái đang load
  // state cho việc loading của ảnh avatar
  const [avatarLoading, setAvatarLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          setIsLoggedIn(false);
          return;
        }
        const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: storedToken }),
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setIsLoggedIn(false);
      }
    }
    checkLogin();
  }, []); // Chạy 1 lần khi component mount

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserInfo(); // Gọi API lấy thông tin người dùng khi đã đăng nhập
    }
  }, [isLoggedIn]);

  // Nếu trạng thái đăng nhập chưa xác định (loading)
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8000" />
      </View>
    );
  }

  // Nếu chưa đăng nhập, hiển thị các nút đăng nhập/đăng ký
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

  // Hàm gọi API lấy thông tin user theo token
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token");
        return;
      }
      const response = await fetch(`${BASE_URL}${Get_info_user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("getInfoUser response:", data);
      if (response.ok) {
        setUserInfo({
          username: data.name,
          avatar_url:
            data.avatar_url && data.avatar_url.trim() !== ""
              ? `${Im_URL}${data.avatar_url}`
              : require("../../assets/images/avatar.png"),
          order_count: data.order_count,
          wishlist_count: data.wishlist_count,
        });
        // Tắt trạng thái loading sau khi set avatar từ server
        setAvatarLoading(false);
      } else {
        console.log("Lỗi getInfoUser:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error in fetchUserInfo:", error);
    }
  };

  const handleLogout = () => {
    setLogoutVisible(false);
    AsyncStorage.removeItem("token"); // Xóa token khi logout
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              typeof userInfo.avatar_url === "string"
                ? { uri: userInfo.avatar_url } 
                : userInfo.avatar_url
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
          <Text style={styles.username}>
            {userInfo.username || "Unknown"}
          </Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>{userInfo.order_count} Đã mua</Text>
            <Text style={styles.statText}>
              {userInfo.wishlist_count} Được thích
            </Text>
          </View>
        </View>
        <CartIcon />
      </View>

      {/* Phần Đơn Mua */}
      <OrderProfileComponent />

      {/* Phần Cài Đặt */}
      <SettingComponent />

      <LogoutDialog
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 15,
    position: "relative", // cần thiết để ActivityIndicator nằm chồng lên ảnh
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  stats: {
    flexDirection: "row",
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginRight: 15,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  authButton: {
    backgroundColor: "#FF8000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
