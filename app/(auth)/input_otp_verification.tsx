import { useState, useRef, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/custom/CustomText";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = () => {
    if (countdown === 0) {
        Alert.alert("Đã gửi OTP mới");
      setCountdown(60);
    }
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === "1234") {
      Alert.alert("Xác thực thành công!", "Chuyển sang màn hình đổi mật khẩu.");
      router.push("/forgot_password");
    } else {
      Alert.alert("Lỗi", "Mã OTP không đúng, vui lòng thử lại.");
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 3) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Xác Thực OTP</CustomText>
      <CustomText style={styles.subtitle}>Nhập mã OTP gồm 4 chữ số</CustomText>
      <CustomText>  </CustomText>
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.otpCircle, isOtpComplete ? styles.otpComplete : otp[index] ? styles.otpActive : styles.otpInactive]}
            value={otp[index]}
            onChangeText={(text) => handleOTPChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !otp[index]) {
                handleBackspace(index);
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
        <CustomText style={styles.verifyButtonText}>Xác Thực</CustomText>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <CustomText style={styles.resendText}>Gửi lại OTP sau: {countdown}s </CustomText>
        <TouchableOpacity onPress={handleResendOTP} disabled={countdown > 0}>
          <CustomText style={[styles.resendButton, countdown > 0 ? styles.resendDisabled : styles.resendEnabled]}>
            Gửi lại
          </CustomText>
        </TouchableOpacity>
      </View>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 5,
  },
  otpInactive: {
    borderColor: "gray",
  },
  otpActive: {
    borderColor: "#FF8000",
  },
  otpComplete: {
    borderColor: "#54B435",
  },
  verifyButton: {
    backgroundColor: "#FF8000",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    color: "gray",
  },
  resendButton: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  resendDisabled: {
    color: "gray",
  },
  resendEnabled: {
    color: "#FF8000",
  },
});
