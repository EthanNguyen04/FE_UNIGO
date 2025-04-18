import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/custom/CustomText";
import { TokenContext } from "@/contexts/TokenContext";
import { BASE_URL, LOGIN_api } from "../../api";
import { AuthContext } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useContext(TokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthData } = useContext(AuthContext);

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (text: string): string => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!text) return "Email không được để trống";
    if (!emailRegex.test(text)) return "Email không hợp lệ";
    return "";
  };

  // Hàm kiểm tra password hợp lệ
  const validatePassword = (text: string): string => {
    if (!text) return "Mật khẩu không được để trống";
    if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const handleLogin = async (): Promise<void> => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Không gửi otp ở bước này, API sẽ gửi OTP qua email
        body: JSON.stringify({ email: email, password: password,}),
      });
      const data = await response.json();

      if (response.status === 200) {
        // Nếu API trả về token, tức OTP đã được xác thực
        if (data.token) {
          setToken(data.token);
          router.push("/home");
        } else {
          // Nếu không có token, tức OTP đã được gửi đến email
          // Chuyển hướng sang màn hình OTP để người dùng nhập OTP
          setAuthData(email, password);
          router.push(`/input_otp_verification?email=${encodeURIComponent(email)}&type=login`);
        }
      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomText style={styles.title}>Chào mừng bạn</CustomText>
        <CustomText style={styles.subtitle}>Đăng nhập để tiếp tục</CustomText>

        {/* Email Input */}
        <CustomText style={styles.label}>Email</CustomText>
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: emailError ? "red" : "gray" },
          ]}
          placeholder="Nhập email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          onBlur={() => setEmailError(validateEmail(email))}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <CustomText style={styles.label}>Mật khẩu</CustomText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, borderBottomColor: passwordError ? "red" : "gray" },
            ]}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="gray"
            secureTextEntry={true}
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            onBlur={() => setPasswordError(validatePassword(password))}
          />
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="eye" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {/* Quên mật khẩu */}
        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/email_verify")}>
          <CustomText style={styles.forgotPassword}>Quên mật khẩu?</CustomText>
        </TouchableOpacity>
        {/* Nút đăng nhập */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <CustomText style={styles.loginButtonText}>Đăng Nhập</CustomText>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomText style={styles.footerText}>
            Bạn chưa có tài khoản?{" "}
            <CustomText style={styles.registerText} onPress={() => router.push("/register")}>
              Đăng Ký
            </CustomText>
          </CustomText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "gray",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#818181",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    marginStart: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#EB0D0D",
    fontSize: 12,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  forgotPassword: {
    color: "black",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#FF8000",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "black",
    fontSize: 14,
  },
  registerText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
