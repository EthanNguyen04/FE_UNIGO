import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/custom/CustomText";
import { BASE_URL, SendOtpRsPass_api } from "../../api";

type SendOTPScreenProps = {
  emailFromLogin?: string;
};

export default function SendOTPScreen({ emailFromLogin }: SendOTPScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState(emailFromLogin || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${SendOtpRsPass_api}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Sau khi gửi OTP thành công, chuyển hướng sang màn /otp
        router.push(`/input_otp_verification?emailR=${encodeURIComponent(email)}&type=resetpassword`);

      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi OTP, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
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
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOTP}>
        {isLoading ? (
          <ActivityIndicator color="white" />
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
    justifyContent: "center",
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
