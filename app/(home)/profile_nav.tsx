import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const settings = [
  { id: "1", title: "Tài Khoản & Bảo Mật" },
  { id: "2", title: "Địa Chỉ" },
  { id: "3", title: "Tài Khoản Thanh Toán" },
  { id: "4", title: "Đăng Xuất" },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7vpY7VDzQP-Mo5L5fUPh4uWg4-ALCeMDVw&s" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>DATN_MD</Text>
          <View style={styles.stats}>
            <Text style={styles.statText}>13 Đã mua</Text>
            <Text style={styles.statText}>11 Được thích</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Đơn Mua */}
      <View style={styles.orderSection}>
        <View style={styles.orderHeader}>
          <Text style={styles.sectionTitle}>ĐƠN MUA</Text>
          <TouchableOpacity>
            <Text style={styles.viewMore}>Xem {">"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orderIcons}>
          <TouchableOpacity style={styles.orderItem}>
            <Ionicons name="cube-outline" size={24} color="#333" />
            <Text style={styles.orderLabel}>Chờ xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderItem}>
            <Ionicons name="car-outline" size={24} color="#333" />
            <Text style={styles.orderLabel}>Chờ lấy hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderItem}>
            <Ionicons name="bicycle-outline" size={24} color="#333" />
            <Text style={styles.orderLabel}>Chờ giao hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderItem}>
            <Ionicons name="star-outline" size={24} color="#333" />
            <Text style={styles.orderLabel}>Đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cài Đặt */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Cài Đặt</Text>
        <FlatList
          data={settings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          )}
        />
      </View>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
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
    fontSize: 14,
    color: "#666",
    marginRight: 15,
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
  orderSection: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  viewMore: {
    fontSize: 14,
    color: "#888",
  },
  orderIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItem: {
    alignItems: "center",
  },
  orderLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  settingsSection: {
    backgroundColor: "#fff",
    padding: 15,
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
});