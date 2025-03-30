import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Icon mắt để ẩn/hiện mật khẩu
import CustomText from "@/components/custom/CustomText";

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (text: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!text) return "Email không được để trống";
    if (!emailRegex.test(text)) return "Email không hợp lệ";
    return "";
  };

  // Hàm kiểm tra password hợp lệ
  const validatePassword = (text: string) => {
    if (!text) return "Mật khẩu không được để trống";
    if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const handleLogin = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (!emailValidation && !passwordValidation) {
      // Xử lý đăng nhập
      console.log("Đăng nhập thành công");
      router.push("/(home)");
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Chào mừng bạn</CustomText>
      <CustomText style={styles.subtitle}>Đăng nhập để tiếp tục</CustomText>

      {/* Email Input */}
      <CustomText style={styles.label}>Email</CustomText>
      <TextInput
        style={[
          styles.input,
          {
            borderBottomColor: focusEmail ? "orange" : emailError ? "red" : "gray",
          },
        ]}
        placeholder="Nhập email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        onFocus={() => {
          setFocusEmail(true);
          setEmailError("");
        }}
        onBlur={() => {
          setFocusEmail(false);
          setEmailError(validateEmail(email));
        }}
      />
      {emailError ? (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {emailError}
        </Text>
      ) : null}

      {/* Password Input */}
      <CustomText style={styles.label}>Mật khẩu</CustomText>
      <View style={[styles.passwordContainer, focusPassword && styles.inputFocused]}>
        <TextInput
          style={[
            styles.input,
            { flex: 1, borderBottomColor: focusPassword ? "orange" : passwordError ? "red" : "gray" },
          ]}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={(text) => setPassword(text)}
          onFocus={() => {
            setFocusPassword(true);
            setPasswordError("");
          }}
          onBlur={() => {
            setFocusPassword(false);
            setPasswordError(validatePassword(password));
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {passwordError}
        </Text>
      ) : null}

      {/* Quên mật khẩu */}
      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/email_verify")}>
        <CustomText style={styles.forgotPassword}>Quên mật khẩu?</CustomText>
      </TouchableOpacity>
{/* hoặc đổi router sang forgot_password */}
      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <CustomText style={styles.loginButtonText}>Đăng Nhập</CustomText>
      </TouchableOpacity>

      {/* Nền cam chứa "Bạn chưa có tài khoản?" */}
      <View style={styles.footer}>
        <CustomText style={styles.footerText}>
          Bạn chưa có tài khoản?{" "}
          <CustomText style={styles.registerText} onPress={() => router.push("/register")}>
            Đăng Ký
          </CustomText>
        </CustomText>
      </View>
    </View>
  );
}

// 🌟 *CSS Styles*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 26, // Dịch lên trên bằng cách tăng font
    fontWeight: "bold",
    marginBottom: 5, // Giảm khoảng cách với subtitle
    
  },
  subtitle: {
    color: "gray",
    marginBottom: 25, // Tăng khoảng cách với form nhập
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: '#818181'
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "transparent",
    ...(Platform.OS === "web" ? { outlineWidth: 0 } : {}),
    marginStart: 5,
  },
  inputFocused: {
    borderBottomColor: "orange",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    position: 'absolute',
    right: 0
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
    padding: 12, // Làm cho nút to hơn
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10, // Giãn cách với input trên
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#EEEAEAA1",
    padding: 10,
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