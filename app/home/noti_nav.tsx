// src/components/maketingManager/Notifications.tsx

"use client";
import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from "react-native";
import { useFocusEffect } from "expo-router";
import { Image } from 'expo-image';
import FixedHeader from "@/components/custom/FixedHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, get_noti } from "../../api";

type NotificationItem = {
  title: string;
  content: string;
  time: string;
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function NotiScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Text style={styles.title}>Thông báo</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA726" style={{ marginTop: 30 }} />
      ) : notifications.length === 0 ? (
        <Text style={styles.emptyText}>Không có thông báo.</Text>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.scrollContainer}>
          {notifications.map((item, index) => (
            <View key={index} style={styles.notificationContainer}>
              <Image source={icons.loa} style={styles.ic} contentFit="contain" />
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                <Text style={styles.notificationText}>{item.content}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF8000",
    marginBottom: 10,
    marginTop: 40,
    marginHorizontal: 20,
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  list: {
    marginBottom: screenHeight * 0.08,
  },
  
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    marginBottom: 10,
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
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 10,
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
});
