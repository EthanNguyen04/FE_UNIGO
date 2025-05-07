import { useState, useRef, useEffect, useContext } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomText from "@/components/custom/CustomText";
import { AuthContext } from "@/contexts/AuthContext";
import { TokenContext } from "@/contexts/TokenContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, LOGIN_api, SendOtpRsPass_api } from "../../api";
import NotiInApp from "@/components/custom/notiInApp";

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

  // Hàm gửi lại OTP: nếu countdown về 0 thì reset countdown và gọi API gửi OTP mới (với otp rỗng)
  const handleResendOTP = async () => {
    if (countdown === 0) {
      setErrorMessage("");
      setCountdown(60);
      setIsLoading(true);
      let response;
      try {
        if (type === "login") {
          response = await fetch(`${BASE_URL}${LOGIN_api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              password: password,
              otp: "", // Gửi otp rỗng để kích hoạt gửi OTP mới
            }),
          });
        } else if (type === "resetpassword") {
          response = await fetch(`${BASE_URL}${SendOtpRsPass_api}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailR,
              otp: "", // Gửi otp rỗng để kích hoạt gửi OTP mới
            }),
          });
        }
        if (!response) {
          setErrorMessage("Loại xác thực không hợp lệ.");
          return;
        }
        const data = await response.json();
        if (response.status === 200) {
          setErrorMessage("OTP đã được gửi lại, vui lòng kiểm tra email!");
        } else {
          setErrorMessage(data.message || "Gửi lại OTP thất bại, vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error resending OTP:", error);
        setErrorMessage("Lỗi gửi lại OTP, vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Hàm xác thực OTP
  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp) {
      setErrorMessage("Chưa nhập OTP");
      return;
    }

    setIsLoading(true);
    try {
      if (type === "login") {
        // Gọi API đăng nhập khi type là login
        const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            password: password,
            otp: enteredOtp,
          }),
        });
        let data: any = {};
        try {
          data = await response.json();
        } catch (jsonError) {
          const text = await response.clone().text();
          console.error("Failed to parse JSON. Response text:", text);
          setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại sau.");
          return;
        }
        if (response.status === 200) {
          setNotificationTitle(data.message || "Đăng nhập thành công!");
          setNotificationActive(true);
          setErrorMessage("");
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('type', "user");
          console.log(data.token);
          router.replace("/home");
        } else if (response.status === 400) {
          setErrorMessage(data.message || "Vui lòng nhập email và mật khẩu!");
        } else if (response.status === 404) {
          setErrorMessage(data.message || "Tài khoản không tồn tại!");
        } else if (response.status === 401) {
          setErrorMessage(data.message || "Mật khẩu hoặc OTP không hợp lệ, vui lòng thử lại.");
        } else {
          setErrorMessage("Xác thực OTP thất bại, vui lòng thử lại.");
        }
      } else if (type === "resetpassword") {
        // Gọi API xác thực OTP cho reset password
        const response = await fetch(`${BASE_URL}${SendOtpRsPass_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailR,
            otp: enteredOtp,
          }),
        });
        let data: any = {};
        try {
          data = await response.json();
        } catch (jsonError) {
          const text = await response.clone().text();
          console.error("Failed to parse JSON. Response text:", text);
          setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại sau.");
          return;
        }
        if (response.status === 200) {
          setNotificationTitle(data.message || "Xác thực OTP thành công!");
          setNotificationActive(true);
          setErrorMessage("");
          // Nhận token trả về và chuyển hướng sang màn hình đặt lại mật khẩu
          router.push(`/forgot_password?token=${encodeURIComponent(data.token)}`);
        } else if (response.status === 400) {
          setErrorMessage(data.message || "Vui lòng nhập đầy đủ thông tin!");
        } else if (response.status === 404) {
          setErrorMessage(data.message || "Tài khoản không tồn tại!");
        } else if (response.status === 401) {
          setErrorMessage(data.message || "OTP không hợp lệ hoặc đã hết hạn.");
        } else {
          setErrorMessage("Xác thực OTP thất bại, vui lòng thử lại.");
        }
      } else {
        setErrorMessage("Loại xác thực không hợp lệ.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại sau.");
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
        <CustomText style={styles.errorText}>{errorMessage}</CustomText>

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

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <CustomText style={styles.verifyButtonText}>Xác Thực</CustomText>
          )}
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
  errorText: {
    color: "#EB0D0D",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
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
