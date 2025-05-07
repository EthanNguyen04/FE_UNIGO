import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, BackHandler } from "react-native";
import CustomText from "@/components/custom/CustomText";
import Feather from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router"; 
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, LOGIN_api } from "../api";

export default function IntroScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      const inApp = await AsyncStorage.getItem("InApp");

      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log(storedToken)
        if (storedToken) {
          // Tạo timeout 8s
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: storedToken }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.status === 200) {
            await AsyncStorage.setItem("InApp", "true");
            router.replace("/home");
            return;
          }
        }

        // Login không thành công => xóa storage, giữ InApp, check lại
        await AsyncStorage.clear();
        await AsyncStorage.setItem("InApp", inApp ?? "");
        if (inApp === "true") {
          router.replace("/home");
          return;
        }
      } catch (error: any) {
        // Không log error lên UI, chỉ show alert
        const isTimeout = error.name === "AbortError";
        Alert.alert(
          "Lỗi kết nối",
          isTimeout
            ? "Kết nối chậm, vui lòng thử lại sau."
            : "Mất kết nối, bạn hãy thông cảm và quay lại sau.",
          [{ text: "OK", onPress: () => BackHandler.exitApp() }],
          { cancelable: false }
        );
        return;
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  const handleStart = async () => {
    // Bật InApp và vào home khi user bấm Bắt đầu
    await AsyncStorage.setItem("InApp", "true");
    router.replace("/home");
  };

  if (loading) {
    return null; // hoặc custom Spinner
  }

  return (
    <ImageBackground
      source={require("../assets/images/intro_img.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <CustomText style={styles.title}>
          Chào mừng đến với{"\n"}UNIGO
        </CustomText>
        <CustomText style={styles.subtitle}>
          Khám phá thời trang cùng chúng tôi
        </CustomText>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Bắt đầu</Text>
        <Feather
          name="arrow-right"
          size={24}
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 150,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    backgroundColor: "#FF8000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    marginLeft: 8,
  },
});
