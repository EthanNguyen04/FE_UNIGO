import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Image } from 'expo-image';
import FixedHeader from "@/components/custom/FixedHeader";
import { BASE_URL, get_noti } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 Define type for a notification item
type NotificationItem = {
  title: string;
  content: string;
  time: string;
};

export default function NotiScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const icons = {
    loa: require("../../assets/images/loa_icon.png"),
    cart: require("../../assets/images/cart_img.png"),
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      let type = await AsyncStorage.getItem('type');
      try {
        const response = await fetch(`${BASE_URL}${get_noti}?type=${type}`);
        const data = await response.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <FixedHeader />

      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" style={{ marginTop: 30 }} />
      ) : notifications.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30 }}>Không có thông báo.</Text>
      ) : (
        notifications.map((item, index) => (
          <View key={index.toString()} style={styles.notificationContainer}>
            <Image source={icons.loa} style={styles.ic} contentFit="contain" />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
              <Text style={styles.notificationText}>{item.content}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0", // Màu nền cam nhạt
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    alignItems: "center",
  },
  ic: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
});
