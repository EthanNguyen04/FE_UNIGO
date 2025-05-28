import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, add_address } from "../../api";

const { width } = Dimensions.get("window");

export interface AddAddressData {
  phone: string;
  addressDetail: string;
  ward: string;
  district: string;
  city: string;
}

interface AddAddressProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (newAddress: any) => void;
  existingAddress?: string; // Nếu có, đại diện cho địa chỉ cũ để sửa
}

export default function AddAddress({
  visible,
  onCancel,
  onSave,
  existingAddress = "",
}: AddAddressProps) {
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  // Nếu có địa chỉ cũ, phân tích chuỗi để tiền điền cho các trường
  useEffect(() => {
    if (existingAddress && existingAddress.trim() !== "") {
      // Giả sử định dạng: "địa chỉ chi tiết, xã, huyện, thành phố"
      const parts = existingAddress.split(",").map((part) => part.trim());
      setAddressDetail(parts[0] || "");
      setWard(parts[1] || "");
      setDistrict(parts[2] || "");
      setCity(parts[3] || "");
    }
  }, [existingAddress]);

  const handleSave = async () => {
    if (!phone || !addressDetail) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại và địa chỉ chi tiết");
      return;
    }
    // Ghép chuỗi địa chỉ từ các trường nhập vào (nếu người dùng chưa thay đổi thì có thể khớp với existingAddress)
    const fullAddress = `${addressDetail}, ${ward}, ${district}, ${city}`;
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Không tìm thấy token, vui lòng đăng nhập lại");
        return;
      }
      // Gọi API dùng chung cho thêm hoặc cập nhật địa chỉ
      const response = await fetch(`${BASE_URL}${add_address}`, {
        method: "POST", // Controller addOrUpdateAddress dùng POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Gửi cùng số điện thoại, địa chỉ mới và oldAddress để backend phân biệt
        body: JSON.stringify({
          phone,
          address: fullAddress,
          oldAddress: existingAddress,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", data.message);
        onSave({ phone, address: fullAddress, oldAddress: existingAddress });
        // Reset lại các field sau khi lưu
        setPhone("");
        setAddressDetail("");
        setWard("");
        setDistrict("");
        setCity("");
      } else {
        Alert.alert("Lỗi", data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error adding/updating address:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Thêm/Chỉnh sửa Địa Chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ chi tiết"
            value={addressDetail}
            onChangeText={setAddressDetail}
          />
          <Text style={styles.label}>Xã</Text>
          <Picker
            selectedValue={ward}
            onValueChange={(itemValue) => setWard(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn xã" value="" />
            <Picker.Item label="Xã A" value="Xã A" />
            <Picker.Item label="Xã B" value="Xã B" />
            {/* Bạn có thể bổ sung thêm danh sách thật từ API hoặc danh mục của Việt Nam */}
          </Picker>
          <Text style={styles.label}>Huyện</Text>
          <Picker
            selectedValue={district}
            onValueChange={(itemValue) => setDistrict(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn huyện" value="" />
            <Picker.Item label="Huyện 1" value="Huyện 1" />
            <Picker.Item label="Huyện 2" value="Huyện 2" />
            {/* Thêm danh sách nếu cần */}
          </Picker>
          <Text style={styles.label}>Thành phố</Text>
          <Picker
            selectedValue={city}
            onValueChange={(itemValue) => setCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Chọn thành phố" value="" />
            <Picker.Item label="TP.HCM" value="TP.HCM" />
            <Picker.Item label="Hà Nội" value="Hà Nội" />
            {/* Bạn có thể thêm các thành phố khác nếu cần */}
          </Picker>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: width * 0.92,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f5f6fa",
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#7f8c8d",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#f5f6fa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#2c3e50",
  },
  pickerItem: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 15,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonSave: {
    flex: 1,
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});