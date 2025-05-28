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
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      setEmailError(emailValidation);
      setPasswordError(passwordValidation);

      if (emailValidation || passwordValidation) return;

      setIsLoading(true);
      const response = await fetch(`${BASE_URL}${LOGIN_api}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        if (data.token) {
          setToken(data.token);
          router.push("/home");
        } else {
          setAuthData(email, password);
          router.push(`/input_otp_verification?email=${encodeURIComponent(email)}&type=login`);
        }
      } else {
        Alert.alert(
          "Lỗi đăng nhập",
          data.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
        "Lỗi kết nối",
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            onBlur={() => setPasswordError(validatePassword(password))}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="gray" 
            />
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
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginStart: 5,
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
  eyeIcon: {
    padding: 8,
  },
});
