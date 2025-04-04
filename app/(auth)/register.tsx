import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator, // Thêm ActivityIndicator để hiển thị spinner loading
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import CustomText from "@/components/custom/CustomText";
import axios from "axios"; // For API call

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

  const [loading, setLoading] = useState(false); 
  // Validate
  const validateEmail = (text: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!text) return "Email không được để trống";
    if (!emailRegex.test(text)) return "Email không hợp lệ";
  
    return ""; // Nếu không có lỗi, trả về chuỗi rỗng
  };
  

  const validatePassword = (text: string) => {
    if (!text) return "Mật khẩu không được để trống";
    if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  // const validatePassword = (text: string) => {
  //   if (!text) return "Mật khẩu không được để trống";
  //   if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    
  //   if (!/[A-Z]/.test(text)) return "Mật khẩu phải có ít nhất một chữ cái viết hoa";
  
  //   if (!/[a-z]/.test(text)) return "Mật khẩu phải có ít nhất một chữ cái viết thường";
  
  //   if (!/\d/.test(text)) return "Mật khẩu phải có ít nhất một chữ số";
  
  //   if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) return "Mật khẩu phải có ít nhất một ký tự đặc biệt";
  
  //   if (/\s/.test(text)) return "Mật khẩu không được chứa khoảng trắng";
  
  //   return ""; // Nếu tất cả các điều kiện trên không bị lỗi, trả về chuỗi rỗng (không có lỗi)
  // };
  

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

  // Handle registration
  const handleRegister = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const rePasswordValidation = validateRePassword(rePassword);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setRePasswordError(rePasswordValidation);

    // Nếu không có lỗi trong các trường dữ liệu
    if (!emailValidation && !passwordValidation && !rePasswordValidation) {
      setLoading(true); // Bắt đầu loading khi gọi API

      try {
        const response = await axios.post("http://192.168.31.165:3000/api/user/register", {
          email,
          password,
          full_name: name,
        });

        if (response.status === 201) {
          console.log("Đăng ký thành công! OTP đã được gửi đến email.");

          // Truyền cả email và password qua URL
          const encodedEmail = encodeURIComponent(email);
          const encodedPassword = encodeURIComponent(password);
          router.push(`/input_otp_verification?email=${encodedEmail}&password=${encodedPassword}&type=register`);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          // Xử lý lỗi nếu có, ví dụ email đã tồn tại
          setEmailError(error.response.data.message);
        } else {
          console.error("Lỗi khi đăng ký:", error);
        }
      } finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Đăng ký</CustomText>

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
      {nameError && (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {nameError}
        </Text>
      )}

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
      {emailError && (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {emailError}
        </Text>
      )}

      {/* Password Input */}
      <CustomText style={styles.label}>Mật khẩu</CustomText>
      <View style={[styles.passwordContainer, focusPassword && styles.inputFocused]}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              borderBottomColor: focusPassword ? "orange" : passwordError ? "red" : "gray",
            },
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
      {passwordError && (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {passwordError}
        </Text>
      )}

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
            setRePasswordError(validateRePassword(rePassword));
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {rePasswordError && (
        <Text style={styles.errorText}>
          <Ionicons name="alert-circle" size={14} color="red" /> {rePasswordError}
        </Text>
      )}

      {/* Register Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" /> // Hiển thị spinner khi đang tải
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
    fontSize: 26, 
    fontWeight: "bold",
    marginBottom: 5, 
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: 20,
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