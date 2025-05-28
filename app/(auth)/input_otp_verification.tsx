import { useState, useRef, useEffect, useContext } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomText from "@/components/custom/CustomText";
import { AuthContext } from "@/contexts/AuthContext";
import { TokenContext } from "@/contexts/TokenContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, LOGIN_api, SendOtpRsPass_api } from "../../api";
import NotiInApp from "@/components/custom/notiInApp";
import * as Updates from "expo-updates";       // ← thêm vào

export default function OTPVerificationScreen() {
  const router = useRouter();
  // Lấy các parameter từ URL, ví dụ: ?emailR=...&type=resetpassword
  const { emailR, type } = useLocalSearchParams();
  // Nếu không có emailR thì dùng email từ AuthContext (cho trường hợp login)
  const { email, password, setAuthData } = useContext(AuthContext);
  const userEmail = type === "resetpassword" ? emailR : email;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationActive, setNotificationActive] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputs = useRef<Array<TextInput | null>>([null, null, null, null]);
  const { setToken } = useContext(TokenContext);

  // Đếm ngược 1 giây
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Hàm gửi lại OTP
  const handleResendOTP = async () => {
    if (countdown === 0) {
      setCountdown(60);
      setIsLoading(true);
      let response;
      try {
        if (type === "login") {
          response = await fetch(`${BASE_URL}${LOGIN_api}`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: userEmail,
              password: password,
              otp: "",
            }),
          });
        } else if (type === "resetpassword") {
          response = await fetch(`${BASE_URL}${SendOtpRsPass_api}`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: emailR,
              otp: "",
            }),
          });
        }

        if (!response) {
          setNotificationTitle("Không thể kết nối đến máy chủ");
          setNotificationActive(true);
          return;
        }

        const data = await response.json();
        
        if (response.ok) {
          setNotificationTitle("OTP đã được gửi lại, vui lòng kiểm tra email!");
          setNotificationActive(true);
        } else {
          setNotificationTitle(data.message || "Gửi lại OTP thất bại");
          setNotificationActive(true);
        }
      } catch (error) {
        console.error("Error resending OTP:", error);
        setNotificationTitle("Lỗi gửi lại OTP, vui lòng thử lại sau");
        setNotificationActive(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Hàm xác thực OTP
  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp) {
      setNotificationTitle("Vui lòng nhập đầy đủ mã OTP");
      setNotificationActive(true);
      return;
    }

    if (enteredOtp.length !== 4) {
      setNotificationTitle("Mã OTP phải gồm 4 chữ số");
      setNotificationActive(true);
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (type === "login") {
        response = await fetch(`${BASE_URL}${LOGIN_api}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            password: password,
            otp: enteredOtp,
          }),
        });
      } else if (type === "resetpassword") {
        response = await fetch(`${BASE_URL}${SendOtpRsPass_api}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            email: emailR,
            otp: enteredOtp,
          }),
        });
      } else {
        setNotificationTitle("Loại xác thực không hợp lệ");
        setNotificationActive(true);
        return;
      }

      if (!response) {
        setNotificationTitle("Không thể kết nối đến máy chủ");
        setNotificationActive(true);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        if (type === "login") {
          setNotificationTitle("Đăng nhập thành công!");
          setNotificationActive(true);
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('type', "user");
          await Updates.reloadAsync();
        } else {
          setNotificationTitle("Xác thực OTP thành công!");
          setNotificationActive(true);
          router.push(`/forgot_password?token=${encodeURIComponent(data.token)}`);
        }
      } else {
        setNotificationTitle(data.message || "Xác thực OTP thất bại");
        setNotificationActive(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setNotificationTitle("Đã có lỗi xảy ra, vui lòng thử lại sau");
      setNotificationActive(true);
    } finally {
      setIsLoading(false);
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
    <View style={styles.parent}>
      {notificationActive && (
        <NotiInApp
          active={true}
          title={notificationTitle}
          onHide={() => setNotificationActive(false)}
        />
      )}

      <View style={styles.container}>
        <CustomText style={styles.title}>Xác Thực OTP</CustomText>
        <CustomText style={styles.subtitle}>Nhập mã OTP gồm 4 chữ số</CustomText>

        <View style={styles.otpContainer}>
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[
                styles.otpCircle,
                isOtpComplete ? styles.otpComplete : otp[index] ? styles.otpActive : styles.otpInactive,
              ]}
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

        <TouchableOpacity 
          style={[
            styles.verifyButton,
            isLoading && styles.verifyButtonDisabled
          ]} 
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <CustomText style={styles.verifyButtonText}>Xác Thực</CustomText>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <CustomText style={styles.resendText}>Gửi lại OTP sau: {countdown}s </CustomText>
          <TouchableOpacity 
            onPress={handleResendOTP} 
            disabled={countdown > 0 || isLoading}
          >
            <CustomText 
              style={[
                styles.resendButton, 
                (countdown > 0 || isLoading) ? styles.resendDisabled : styles.resendEnabled
              ]}
            >
              Gửi lại
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
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
  verifyButtonDisabled: {
    backgroundColor: "#FFB366",
    opacity: 0.7,
  },
});
