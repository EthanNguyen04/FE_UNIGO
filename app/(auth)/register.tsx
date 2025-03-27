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

export default function RegisterScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusRePassword, setFocusRePassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");

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

  // Hàm kiểm tra xác nhận mật khẩu hợp lệ
  const validateRePassword = (text: string) => {
    if (!text) return "Vui lòng nhập lại mật khẩu";
    if (text !== password) return "Mật khẩu không khớp";
    return "";
  };

  // Hàm kiểm tra name hợp lệ
  const validateName = (text: string) => {
    if (!text) return "Tên không được để trống";
    if (text.length < 3) return "Tên phải có ít nhất 3 ký tự";
    return "";
  };



  const handleRegister = () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const rePasswordValidation = validateRePassword(rePassword);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setRePasswordError(rePasswordValidation);

    if (!emailValidation && !passwordValidation && !rePasswordValidation) {
      console.log("Đăng ký thành công");
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Đăng ký</CustomText>
      <CustomText>   </CustomText>
      {/* <CustomText style={styles.subtitle}>Đăng nhập để tiếp tục</CustomText> */}


      {/* Name Input */}
      <CustomText style={styles.label}>Name</CustomText>
      <TextInput
        style={[
          styles.input,
          {
            borderBottomColor: focusName ? "orange" : nameError ? "red" : "gray",
          },
        ]}
        placeholder="Nhập tên"
        placeholderTextColor="gray"
        value={name}
        onChangeText={(text) => setName(text)}
        onFocus={() => {
          setFocusName(true);
          setNameError("");
        }}
        onBlur={() => {
          setFocusName(false);
          setNameError(validateName(name));
        }}
      />
      {nameError ? (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {nameError}
        </Text>
      ) : null}

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

      {/* RePassword Input */}
      <CustomText style={styles.label}>Nhập lại mật khẩu</CustomText>
      <View style={[styles.passwordContainer, focusPassword && styles.inputFocused]}>
        <TextInput
          style={[
            styles.input,
            { flex: 1, borderBottomColor: focusRePassword ? "orange" : rePasswordError ? "red" : "gray" },
          ]}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry={!passwordVisible}
          value={rePassword}
          onChangeText={(text) => setRePassword(text)}
          onFocus={() => {
            setFocusRePassword(true);
            setRePasswordError("");
          }}
          onBlur={() => {
            setFocusRePassword(false);
            setRePasswordError(validateRePassword(password));
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {rePasswordError ? (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {rePasswordError}
        </Text>
      ) : null}
 
      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <CustomText style={styles.loginButtonText}>Đăng Ký</CustomText>
      </TouchableOpacity>

      {/* Nền cam chứa "Bạn chưa có tài khoản?" */}
      <View style={styles.footer}>
        <CustomText style={styles.footerText}>
          Bạn đã có tài khoản?{" "}
          <CustomText style={styles.registerText} onPress={() => router.back()}>
            Đăng Nhập
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
  loginButton: {
    backgroundColor: "#FF8000",
    padding: 12, // Làm cho nút to hơn
    borderRadius: 20,
    alignItems: "center",
    marginTop: 50, // Giãn cách với input trên
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