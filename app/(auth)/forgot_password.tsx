import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/custom/CustomText";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Portal, Dialog, Button, Text } from "react-native-paper";
import React from 'react';
import DialogOTP from "./dialogOTP";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState("");
  const [otpDialogVisible, setOtpDialogVisible] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await SecureStore.getItemAsync("reset_token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy token, vui lòng thử lại.");
        router.push("/login");
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (email) {
      console.log('Email received:', email);
    } else {
      console.log('Email is undefined');
    }
  }, [email]);

  const validatePassword = (text: string) => {
    if (!text) return "Mật khẩu không được để trống";
    if (text.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const validateConfirmPassword = (text: string) => {
    if (!text) return "Vui lòng nhập lại mật khẩu";
    if (text !== password) return "Mật khẩu không khớp";
    return "";
  };

  const handleResetPassword = async () => {
    const passwordValidation = validatePassword(password);
    setPasswordError(passwordValidation);

    if (passwordValidation) {
      setConfirmPasswordError("");
      return;
    }

    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);
    setConfirmPasswordError(confirmPasswordValidation);

    if (!passwordValidation && !confirmPasswordValidation) {
      try {
        const response = await axios.post("http://192.168.31.165:3000/api/user/set_newpass", {
          token,
          newPassword: password,
        });

        if (response.status === 200) {
          setSuccessMessage("Đổi mật khẩu thành công");
          setTimeout(async () => {
            await SecureStore.deleteItemAsync("reset_token");
            router.push("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Reset password error:", error);

        if (error.response?.status === 401) {
          setOtpDialogVisible(true);
        } else {
          Alert.alert("Lỗi", error.response?.data?.message || "Đổi mật khẩu thất bại.");
        }
      }
    }
  };

  const handleResendOTP = async () => {
    if (email) {
      try {
        const response = await axios.post("http://192.168.31.165:3000/api/user/send_otprs", { email });
        if (response.status === 200) {
          Alert.alert("Thành công", "OTP đã được gửi đến email của bạn.");
          setOtpDialogVisible(false);
          router.push({
            pathname: "/input_otp_verification",
            params: { email, type: "send_otprs" },
          });
        } else {
          Alert.alert("Lỗi", response.data.message || "Không thể gửi OTP.");
        }
      } catch (otpError) {
        console.error("Lỗi khi gửi OTP:", otpError);
        Alert.alert("Lỗi", otpError.response?.data?.message || "Email không tồn tại trong hệ thống.");
      }
    } else {
      Alert.alert("Lỗi", "Không có email để gửi OTP.");
    }
  };

  const handleCancelOTP = () => {
    setOtpDialogVisible(false);
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Thay đổi mật khẩu</CustomText>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError(validatePassword(text));
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {passwordError ? <CustomText style={styles.errorText}>{passwordError}</CustomText> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError(validateConfirmPassword(text));
          }}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? <CustomText style={styles.errorText}>{confirmPasswordError}</CustomText> : null}

      <TouchableOpacity style={styles.verifyButton} onPress={handleResetPassword}>
        <CustomText style={styles.verifyButtonText}>Xác Nhận</CustomText>
      </TouchableOpacity>

      <DialogOTP
        visible={otpDialogVisible}
        onCancel={handleCancelOTP}
        onConfirm={handleResendOTP}
      />


      <Portal>
        <Dialog visible={Boolean(successMessage)} onDismiss={() => setSuccessMessage("")}>
          <Dialog.Title>Thông báo</Dialog.Title>
          <Dialog.Content>
            <Text>{successMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccessMessage("")}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  verifyButton: {
    backgroundColor: "#FF8000",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  verifyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#EB0D0D",
    marginTop: -10,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#030303",
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FF8000",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
