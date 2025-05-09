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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>ĐƠN MUA</Text>
        <TouchableOpacity onPress={() => router.push('/orders/[tab]')}>
          <Text style={styles.viewMore}>Xem {">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsRow}>
        {/** Chờ xác nhận */}
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => router.push({ pathname: '/orders/[tab]', params: { tab: 'pendingConfirmation' } })}
        >
          <View style={styles.iconContainer}>
            <Image source={icons.xac_nhan} style={styles.orderIcon} contentFit="contain" />
            <Text style={styles.orderLabel}>Chờ xác nhận</Text>
            {orderCounts.choXacNhan > 0 && (
              <Text style={styles.redLabel}>{orderCounts.choXacNhan}</Text>
            )}
          </View>
        </TouchableOpacity>
        {/** Chờ lấy hàng */}
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => router.push({ pathname: '/orders/[tab]', params: { tab: 'waitingPickup' } })}
        >
          <View style={styles.iconContainer}>
            <Image source={icons.cho_lay} style={styles.orderIcon} contentFit="contain" />
            <Text style={styles.orderLabel}>Chờ lấy hàng</Text>
            {orderCounts.choLayHang > 0 && (
              <Text style={styles.redLabel}>{orderCounts.choLayHang}</Text>
            )}
          </View>
        </TouchableOpacity>
        {/** Chờ giao hàng */}
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => router.push({ pathname: '/orders/[tab]', params: { tab: 'delivering' } })}
        >
          <View style={styles.iconContainer}>
            <Image source={icons.cho_giao} style={styles.orderIcon} contentFit="contain" />
            <Text style={styles.orderLabel}>Chờ giao hàng</Text>
            {orderCounts.choGiaoHang > 0 && (
              <Text style={styles.redLabel}>{orderCounts.choGiaoHang}</Text>
            )}
          </View>
        </TouchableOpacity>
        {/** Đánh giá */}
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => router.push({ pathname: '/orders/[tab]', params: { tab: 'delivered' } })}
        >
          <View style={styles.iconContainer}>
            <Image source={icons.review} style={styles.orderIcon} contentFit="contain" />
            <Text style={styles.orderLabel}>Đánh giá</Text>
            {orderCounts.daGiao > 0 && (
              <Text style={styles.redLabel}>{orderCounts.daGiao}</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
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
  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  orderItem: {
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
  },
  orderIcon: {
    width: 50,
    height: 50,
  },
  orderLabel: {
    fontSize: 10,
    color: "#333",
    marginTop: 5,
  },
  redLabel: {
    position: "absolute",
    bottom: 15,
    right: 5,
    fontSize: 12,
    color: "red",
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 5,
  },
});
