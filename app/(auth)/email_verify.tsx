import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/custom/CustomText";
import axios from "axios";
import { ActivityIndicator } from "react-native"; // Đảm bảo import ActivityIndicator

type SendEmailScreenProps = {
  emailFromLogin?: string;
};

export default function SendEmailScreen({ emailFromLogin }: SendEmailScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState(emailFromLogin || "");
  const [loading, setLoading] = useState(false); // Đặt `useState` trong component

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return;
    }

    setLoading(true); // 👉 Bắt đầu loading

    try {
      const response = await axios.post("http://192.168.31.165:3000/api/user/send_otprs", {
        email,
      });

      if (response.status === 200) {
        Alert.alert("Thành công", "OTP đã được gửi đến email của bạn.");
        router.push({
          pathname: "/input_otp_verification",
          params: { email: email, type: "send_otprs" },
        });
      } else {
        Alert.alert("Lỗi", response.data.message || "Không thể gửi OTP.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi OTP:", error);
      const errorMessage = error.response?.data?.message || "Email không tồn tại trong hệ thống.";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false); // 👉 Dừng loading
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Quên Mật Khẩu</CustomText>
      <CustomText style={styles.subtitle}>Nhập email của bạn để nhận mã OTP</CustomText>
      <CustomText>{" "}</CustomText>
      <CustomText style={styles.label}>Email</CustomText>
      <TextInput
        style={[styles.input, { borderBottomColor: "gray" }]}
        placeholder="Nhập email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TouchableOpacity
        style={[styles.sendOtpButton, loading && { opacity: 0.6 }]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <CustomText style={styles.sendOtpButtonText}>Gửi OTP</CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "gray",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#818181",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  sendOtpButton: {
    backgroundColor: "#FF8000",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  sendOtpButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
