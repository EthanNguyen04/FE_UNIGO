// components/home/profile/OrderProfileComponent.tsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { BASE_URL, get_oder_count } from "../../../api";

const icons = {
  xac_nhan: require("../../../assets/images/load_oder_img.png"),
  cho_lay: require("../../../assets/images/send_img.png"),
  cho_giao: require("../../../assets/images/sending_img.png"),
  review: require("../../../assets/images/evalute_img.png"),
};

type Counts = {
  choXacNhan: number;
  choLayHang: number;
  choGiaoHang: number;
  daGiao: number;
};

export default function OrderProfileComponent() {
  const [orderCounts, setOrderCounts] = useState<Counts>({
    choXacNhan: 0,
    choLayHang: 0,
    choGiaoHang: 0,
    daGiao: 0,
  });
  const router = useRouter();

  const fetchOrderCount = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${BASE_URL}${get_oder_count}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrderCounts({
        choXacNhan: data.cho_xac_nhan,
        choLayHang: data.cho_lay_hang,
        choGiaoHang: data.dang_giao,
        daGiao: data.da_giao,
      });
    } catch (error) {
      console.error("Error fetching order counts:", error);
      Alert.alert("Lỗi", "Không thể tải được số đơn hàng");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrderCount();
    }, [fetchOrderCount])
  );

  const renderItem = (icon: any, label: string, count: number, tab: string) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push({ pathname: "/orders/[tab]", params: { tab } })}
    >
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.orderIcon} contentFit="contain" />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </View>
      <Text style={styles.orderLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>ĐƠN MUA</Text>
        <TouchableOpacity onPress={() => router.push("/orders/[tab]")}>
          <Text style={styles.viewMore}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsRow}>
        {renderItem(icons.xac_nhan, "Chờ xác nhận", orderCounts.choXacNhan, "pendingConfirmation")}
        {renderItem(icons.cho_lay, "Chờ lấy hàng", orderCounts.choLayHang, "waitingPickup")}
        {renderItem(icons.cho_giao, "Chờ giao hàng", orderCounts.choGiaoHang, "delivering")}
        {renderItem(icons.review, "Đánh giá", orderCounts.daGiao, "delivered")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6B00",
  },
  viewMore: {
    fontSize: 14,
    color: "#888",
  },
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  orderItem: {
    alignItems: "center",
    width: 70,
  },
  iconContainer: {
    position: "relative",
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  orderLabel: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});