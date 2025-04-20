import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/custom/CustomText";
import { BASE_URL, REGISTER_api } from "../../api";
import { AuthContext } from "@/contexts/AuthContext";

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
  const [isLoading, setIsLoading] = useState(false);

  const { setAuthData } = useContext(AuthContext);

  const validateEmail = (text: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!text) return "Email không được để trống";
    if (!emailRegex.test(text)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (text: string) => {
    if (!text) return "Mật khẩu không được để trống";
    if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const validateRePassword = (text: string) => {
    if (!text) return "Vui lòng nhập lại mật khẩu";
    if (text !== password) return "Mật khẩu không khớp";
    return "";
  };

  const validateName = (text: string) => {
    if (!text) return "Tên không được để trống";
    if (text.length < 3) return "Tên phải có ít nhất 3 ký tự";
    return "";
  };

  const handleRegister = async () => {
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const rePasswordValidation = validateRePassword(rePassword);

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setRePasswordError(rePasswordValidation);

    if (!nameValidation && !emailValidation && !passwordValidation && !rePasswordValidation) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}${REGISTER_api}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            full_name: name,
          }),
        });

        if (response.status === 201) {
          console.log("Đăng ký thành công, OTP được gửi đến email");
          // Lưu thông tin đăng ký và chuyển sang màn hình nhập OTP
          setAuthData(email, password);
          router.push(`/input_otp_verification?email=${encodeURIComponent(email)}&type=login`);
        } else if (response.status === 400) {
          setEmailError("Email đã tồn tại");
        } else if (response.status === 422) {
          console.log("Thiếu email, mật khẩu hoặc họ tên");
        } else if (response.status === 500) {
          console.log("Lỗi hệ thống");
        } else {
          console.log("Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <CustomText style={styles.title}>Đăng ký</CustomText>
        <CustomText style={styles.spacer}></CustomText>

        {/* Name Input */}
        <CustomText style={styles.label}>Name</CustomText>
        <TextInput
          style={[
            styles.input,
            { borderBottomColor: focusName ? "orange" : nameError ? "red" : "gray" },
          ]}
          placeholder="Nhập tên"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
          onFocus={() => { setFocusName(true); setNameError(""); }}
          onBlur={() => { setFocusName(false); setNameError(validateName(name)); }}
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
            { borderBottomColor: focusEmail ? "orange" : emailError ? "red" : "gray" },
          ]}
          placeholder="Nhập email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => { setFocusEmail(true); setEmailError(""); }}
          onBlur={() => { setFocusEmail(false); setEmailError(validateEmail(email)); }}
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
            onChangeText={setPassword}
            onFocus={() => { setFocusPassword(true); setPasswordError(""); }}
            onBlur={() => { setFocusPassword(false); setPasswordError(validatePassword(password)); }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
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
        <View style={[styles.passwordContainer, focusRePassword && styles.inputFocused]}>
          <TextInput
            style={[
              styles.input,
              { flex: 1, borderBottomColor: focusRePassword ? "orange" : rePasswordError ? "red" : "gray" },
            ]}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="gray"
            secureTextEntry={!passwordVisible}
            value={rePassword}
            onChangeText={setRePassword}
            onFocus={() => { setFocusRePassword(true); setRePasswordError(""); }}
            onBlur={() => { setFocusRePassword(false); setRePasswordError(validateRePassword(password)); }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {rePasswordError ? (
          <Text style={styles.errorText}>
            <Ionicons name="alert-circle" size={14} color="red" /> {rePasswordError}
          </Text>
        ) : null}

        {/* Nút đăng ký */}
        <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <CustomText style={styles.loginButtonText}>Đăng Ký</CustomText>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomText style={styles.footerText}>
            Bạn đã có tài khoản?{" "}
            <CustomText style={styles.registerText} onPress={() => router.back()}>
              Đăng Nhập
            </CustomText>
          </CustomText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    marginTop: 30
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  spacer: {
    height: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#818181",
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
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
  },
  errorText: {
    color: "#EB0D0D",
    fontSize: 12,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#FF8000",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 50,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
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

