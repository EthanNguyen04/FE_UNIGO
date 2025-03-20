import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from "react-native";
import { router } from "expo-router";

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
      <View style={styles.header}>
        <Text style={styles.headerText}>THÔNG BÁO</Text>
        <TouchableOpacity style={styles.cartIconContainer}>
          <View style={styles.iconBackground}>
          <Image source={icons.cart} style={styles.ic_cart} />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      {notifications.map((item) => (
        <View key={item.id} style={styles.notificationContainer}>
            <Image source={icons.loa} style={styles.ic} />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            <Text style={styles.notificationText}>{item.content}</Text>
          </View>
        </View>
      ))}

      {/* Link đến Flash Sale */}
      <Button title="Chuyển đến Sale" onPress={() => router.push("/flash_sale_screen")} />
      <Button title="Chuyển đến product" onPress={() => router.push("/product_screen")} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF8C00", // Màu cam
  },
  cartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 50, // Kích thước nền tròn
    height: 50,
    borderRadius: 50, // Làm tròn viền (bằng 1/2 width & height)
    backgroundColor: "#EEEDED", // Màu nền (đổi theo UI của bạn)
    justifyContent: "center",
    alignItems: "center",
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
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0", // Màu nền cam nhạt
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    alignItems: "center",
  },
  icon: {
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
  ic: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  ic_cart: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  
});