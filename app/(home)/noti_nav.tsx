import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotiScreen() {
  const notifications = [
    {
      id: "1",
      title: "Tiêu Đề Thông Báo",
      time: "00:00 23/2/2025",
      content: "Nội Dung Thông Báo Baozvvvvvvvvvvvvvvvv",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>THÔNG BÁO</Text>
        <TouchableOpacity style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Danh sách thông báo */}
      {notifications.map((item) => (
        <View key={item.id} style={styles.notificationContainer}>
          <Ionicons name="megaphone-outline" size={24} color="#FF8C00" style={styles.icon} />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
            <Text style={styles.notificationText}>{item.content}</Text>
          </View>
        </View>
      ))}
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
    position: "relative",
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
});