import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BASE_URL , change_payment} from "../../api";

const PaymentScreen: React.FC = () => {
  const { paymentUrl, order_Id } = useLocalSearchParams<{ paymentUrl: string; order_Id: string }>();
  const [lastUrl, setLastUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log(paymentUrl)
    console.log(`${BASE_URL}${change_payment}${order_Id}`)
    if (lastUrl.includes("vnpay/vnpay_return")) {
      (async () => {
        try {
          const res = await fetch(lastUrl);
          ToastAndroid.show(`Return URL status: ${res.status}`, ToastAndroid.SHORT);

          const token = await AsyncStorage.getItem("token");
          if (res.status === 200 && token) {
            const updateRes = await fetch(
              `${BASE_URL}${change_payment}${order_Id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ payment_status: "da_thanh_toan" }),
              }
            );
            ToastAndroid.show(
              `Thanh toán thành công`,
              ToastAndroid.SHORT
            );
          }
        } catch (e) {
          console.error(e);
        } finally {
          router.back();
        }
      })();
    }
  }, [lastUrl]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeText}>Đóng</Text>
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={nav => setLastUrl(nav.url)}
        onError={() => ToastAndroid.show("Lỗi tải trang thanh toán", ToastAndroid.SHORT)}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: { padding: 12, backgroundColor: "#fff", alignItems: "flex-end" },
  closeText: { fontSize: 16, color: "#FF6600" },
  footer: { padding: 10, backgroundColor: "#fff", alignItems: "center" },
  footerText: { fontSize: 12, color: "#666" },
});
