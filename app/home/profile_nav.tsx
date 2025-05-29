// ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Updates from "expo-updates";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';

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

const { width } = Dimensions.get('window');

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
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </LinearGradient>
    );
  }

  // 5) Nếu chưa login
  if (!isLoggedIn) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.authContainer}
      >
        <View style={styles.authCard}>
          <View style={styles.authIconContainer}>
            <Text style={styles.authIcon}>👋</Text>
          </View>
          <Text style={styles.authTitle}>Chào mừng bạn!</Text>
          <Text style={styles.authSubtitle}>
            Đăng nhập để trải nghiệm đầy đủ tính năng
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <LinearGradient
              colors={['#FF8A65', '#FF5722']}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryButtonText}>Đăng ký tài khoản</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.topBar}>
              <CartIcon />
            </View>
            
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
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
                    <View style={styles.avatarLoading}>
                      <ActivityIndicator size="small" color="#FF8A65" />
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{username || "Unknown"}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{order_count}</Text>
                    <Text style={styles.statLabel}>Số lượng mua</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{wishlist_count}</Text>
                    <Text style={styles.statLabel}>Yêu thích</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.contentContainer}>
          <OrderProfileComponent />
          <SettingComponent />
          
          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutVisible(true)}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      {/* </ScrollView> */}

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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
  
  // Auth States
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 25,
    alignItems: 'center',
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  authIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  authIcon: {
    fontSize: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Header
  headerGradient: {
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
  },
  avatarLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 41,
  },
  userDetails: {
    flex: 1,
    marginTop: 10
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    // marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 7,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Content
  contentContainer: {
    padding: 2,
    paddingTop: 2,
  },
  
  // Logout Button
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});