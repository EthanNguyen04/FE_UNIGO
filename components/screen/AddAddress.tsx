import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, add_address } from "../../api";

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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  buttonCancel: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonSave: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
