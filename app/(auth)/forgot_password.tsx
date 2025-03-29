import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/custom/CustomText";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Hàm kiểm tra mật khẩu hợp lệ
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

  const handleResetPassword = () => {
    const passwordValidation = validatePassword(password);
    setPasswordError(passwordValidation);
    
    if (passwordValidation) {
      setConfirmPasswordError("");
      return;
    }

    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);
    setConfirmPasswordError(confirmPasswordValidation);

    if (!passwordValidation && !confirmPasswordValidation) {
      setSuccessMessage("Đổi mật khẩu thành công");
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setModalVisible(false);
          router.push("/login");
        });
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Thay đổi mật khẩu</CustomText>
      <CustomText>   </CustomText>
      {/* Nhập mật khẩu mới */}
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

      {/* Nhập lại mật khẩu mới */}
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

      {/* Nút Xác Nhận */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleResetPassword}>
        <CustomText style={styles.verifyButtonText}>Xác Nhận</CustomText>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <CustomText style={styles.successText}>{successMessage}</CustomText>
          </Animated.View>
        </View>
      </Modal>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  successText: {
    color: "green",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
