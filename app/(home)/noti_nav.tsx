import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Image } from 'expo-image';  // Import expo-image
import FixedHeader from "@/components/custom/FixedHeader";
import { Button } from "react-native";

export default function NotiScreen() {
  const notifications = [
    {
      id: "1",
      title: "Tiêu Đề Thông Báo",
      time: "00:00 23/2/2025",
      content: "Nội Dung Thông Báo Baozvvvvvvvvvvvvvvvv",
    },
  ];

  const icons = {
    loa: require("../../assets/images/loa_icon.png"),
    cart: require("../../assets/images/cart_img.png"),
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <FixedHeader />

      {/* Danh sách thông báo */}
      {notifications.map((item) => (
        <View key={item.id} style={styles.notificationContainer}>
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

      {/* Link đến các màn hình khác */}
      <Button title="Chuyển đến Sale" onPress={() => router.push("/flash_sale_screen")} />
      <Button title="Chuyển đến product" onPress={() => router.push("/product_screen")} />
      <Button title="Chuyển đến cart" onPress={() => router.push("/cart_screen")} />
      <Button title="Chuyển đến order" onPress={() => router.push("/order_screen")} />
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
