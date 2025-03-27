import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/custom/CustomText";

type SendOTPScreenProps = {
  emailFromLogin?: string;
};

export default function SendOTPScreen({ emailFromLogin }: SendOTPScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState(emailFromLogin || "");

  const handleSendOTP = () => {
    console.log("Gửi OTP tới email:", email);
    Alert.alert("OTP đã được gửi!", `Vui lòng kiểm tra email: ${email}`);
    router.push("/input_otp_verification");
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
        <CustomText style={styles.sendOtpButtonText}>Gửi OTP</CustomText>
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
    fontWeight: "600",
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
