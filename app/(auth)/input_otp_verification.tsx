import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/custom/CustomText";
import { useLocalSearchParams } from "expo-router";
import axios from "axios"; 
import * as SecureStore from "expo-secure-store";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [serverOTP, setServerOTP] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<Array<TextInput | null>>([null, null, null, null]);
  const { email, password, type } = useLocalSearchParams();
  
  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");

    if (!enteredOtp) {
      Alert.alert("Lỗi", "Chưa nhập OTP");
      return;
    }

    try {
      if (type == "register") {
        const response = await axios.post("http://192.168.31.165:3000/api/user/login", {
          email,
          password,
          otp: enteredOtp,
        });

        if (response.status === 200) {
          Alert.alert("", "Đăng nhập thành công!");
          router.push("/home");
        } else {
          Alert.alert("Lỗi", "OTP không đúng hoặc đăng nhập thất bại.");
        }
      } else if (type == "login") {
        const response = await axios.post("http://192.168.31.165:3000/api/user/login", {
          email,
          password,
          otp: enteredOtp,
        });

        if (response.status === 200) {
          // Alert.alert("Thành công", "Đăng nhập thành công!");
          router.push("/home");
        } else {
          Alert.alert("Lỗi", "OTP không đúng hoặc đăng nhập thất bại.");
        }
      } else if (type === "send_otprs") {
        console.log("Email received:", email);
        const response = await axios.post("http://192.168.31.165:3000/api/user/send_otprs", {
          email: email,
          otp: enteredOtp,
        });

        if (response.status === 200 && response.data.token) {
          await SecureStore.setItemAsync("reset_token", response.data.token);
          Alert.alert("Thành công", "Xác thực OTP thành công!");
          console.log('Email ở input otp', email);
          router.push({
            pathname: "/forgot_password",
            params: { email: email},
          });
          
        } else {
          Alert.alert("Lỗi", "OTP không đúng hoặc xác thực thất bại.");
        }
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      Alert.alert("Lỗi", error.response?.data?.message || "Xác thực OTP thất bại.");
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (countdown === 0) {
      try {
        if (type === "send_otprs") {
          const response = await axios.post("http://192.168.31.165:3000/api/user/send_otprs", {
            email,
          });
  
          if (response.status === 200) {
            Alert.alert("", "Đã gửi lại OTP mới.");
            setCountdown(60);
          } else {
            Alert.alert("Lỗi", response.data.message || "Không thể gửi lại OTP.");
          }
        } else {
          const response = await axios.post("http://192.168.31.165:3000/api/user/login", {
            email,
            password,
          }); // đăng nhập đăng ký dùng chung api
  
          if (response.status === 200 && response.data.message === "OTP đã được gửi đến email.") {
            Alert.alert("", "Đã gửi lại OTP mới.");
            setCountdown(60);
          } else {
            Alert.alert("Lỗi", response.data.message || "Không thể gửi lại OTP.");
          }
        }
      } catch (error) {
        console.error("Lỗi gửi lại OTP:", error);
        Alert.alert("Lỗi", "Gửi lại OTP thất bại.");
      }
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

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Xác Thực OTP</CustomText>
      <CustomText style={styles.label}>OTP đã được gửi về email {email}</CustomText>
      <CustomText style={styles.subtitle}>Nhập mã OTP gồm 4 chữ số</CustomText>
      <View style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.otpCircle, otp[index] ? styles.otpActive : styles.otpInactive]}
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
        {countdown > 0 ? (
          <Text style={styles.countdownText}>Gửi lại OTP sau: {countdown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={[styles.resendText, styles.resendEnabled]}>Gửi lại</Text>
          </TouchableOpacity>
        )}
      </View>
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
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#818181",
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
  resendEnabled: {
    color: "#FF8000",
    fontWeight: "bold",
  },
});
