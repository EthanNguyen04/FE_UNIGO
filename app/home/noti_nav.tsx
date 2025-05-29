"use client";
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, get_noti } from "../../api";

type NotificationItem = {
  title: string;
  content: string;
  time: string;
  image: string;
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function NotiScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const Token = await AsyncStorage.getItem("token");
      let type = Token ? await AsyncStorage.getItem("type") : "khach";
      const res = await fetch(`${BASE_URL}${get_noti}?type=${type}`);
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      Alert.alert("Lỗi", "Không thể tải thông báo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const icons = {
    loa: require("../../assets/images/loa_icon.png"),
    cart: require("../../assets/images/cart_img.png"),
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Thông báo</Text>
          <View style={styles.iconContainer}>
            <MaterialIcons name="notifications" size={28} color="#fff" />
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={80} color="#e0e7ff" />
          <Text style={styles.emptyText}>Không có thông báo</Text>
          <Text style={styles.emptySubText}>Các thông báo mới sẽ xuất hiện tại đây</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.scrollContainer}>
          {notifications.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.notificationContainer, { transform: [{ scale: 1 }] }]}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/NotificationDetail",
                  params: {
                    title: item.title,
                    content: item.content,
                    time: item.time,
                    image: item.image,
                  },
                })
              }
            >
              <View style={styles.iconWrapper}>
                <Image source={item.image} style={styles.ic} contentFit="contain" />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.notificationText} numberOfLines={2} ellipsizeMode="tail">
                  {item.content}
                </Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
              <View style={styles.chevronContainer}>
                <MaterialIcons name="chevron-right" size={20} color="#a0a0a0" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  titleWrapper: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: 'rgba(255, 60, 0, 0.8)', // Fallback for React Native
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#475569",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
    marginBottom: screenHeight * 0.08,
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(4, 83, 126, 0.20)",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  ic: {
    width: 24,
    height: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    lineHeight: 22,
  },
  notificationTime: {
    fontSize: 13,
    color: "#64748b",
    // marginLeft: 12,
    fontWeight: "500",
  },
  notificationText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 20,
    fontWeight: "400",
  },
  chevronContainer: {
    marginLeft: 12,
    padding: 4,
  },
});