import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import CustomText from "@/components/custom/CustomText";
import Feather from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router"; 
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

export default function IntroScreen() {
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  useEffect(() => {
    // Kiểm tra AsyncStorage xem có giá trị InApp không
    const checkInApp = async () => {
      try {
        const inApp = await AsyncStorage.getItem("InApp");
        
        if (inApp === "true") {
          // Nếu InApp = true, điều hướng ngay đến /home mà không cần hiển thị màn hình intro
          router.replace("/home"); // Sử dụng replace để không cho phép quay lại màn hình intro
        }
      } catch (error) {
        console.error("Error reading AsyncStorage", error);
      }
    };

    checkInApp();  // Kiểm tra khi component được render
  }, [router]);

  const handleStart = async () => {
    try {
      // Khi nhấn bắt đầu, thiết lập AsyncStorage InApp = true và điều hướng đến /home
      await AsyncStorage.setItem("InApp", "true");
      router.replace("/home"); // Điều hướng đến trang home và không cho phép quay lại màn hình intro
    } catch (error) {
      console.error("Error writing AsyncStorage", error);
    }
  };

  return (
    <ImageBackground 
      source={require("../assets/images/intro_img.png")} // Ảnh nền
      style={styles.background}
    >
      <View style={styles.overlay}>
        <CustomText style={styles.title}>Chào mừng đến với{"\n"}UNIGO</CustomText>
        <CustomText style={styles.subtitle}>Khám phá thời trang cùng chúng tôi</CustomText>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Bắt đầu</Text>
        <Feather name="arrow-right" size={24} color="white" style={styles.icon} />
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
    backgroundColor: "rgba(0,0,0,0.1)", // Lớp phủ giúp chữ dễ đọc hơn
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.9)", // Màu bóng
    textShadowOffset: { width: 2, height: 2 }, // Dịch bóng
    textShadowRadius: 5, // Độ mờ bóng
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 150,
    textShadowColor: "rgba(0, 0, 0, 0.8)", // Tương tự như trên
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
    marginLeft: 8, // Khoảng cách giữa chữ và icon
  },
});
