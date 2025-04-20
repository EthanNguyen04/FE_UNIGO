import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // hoặc 'react-native-vector-icons/Ionicons'
import HeaderWithBack from "@/components/custom/headerBack"; // Đường dẫn tùy dự án

const DeliveryInfo: React.FC = () => {
  return (
      <View style={styles.deliveryContainer}>
        {/* Dòng: Icon & Tiêu đề */}
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={20} color="#FF6600" />
          <Text style={styles.locationText}>Địa chỉ nhận hàng</Text>
        </View>

        {/* Dòng: Tên khách hàng & SĐT & nút sửa */}
        <View style={styles.row}>
          <Text style={styles.customerName}>Tên khách hàng</Text>
          <Text style={styles.phoneNumber}>012345678</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <Ionicons name="pencil-outline" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Dòng: Địa chỉ nhận hàng */}
        <Text style={styles.address}>Địa chỉ nhận hàng</Text>
      </View>
  );
};

export default DeliveryInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  deliveryContainer: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 12,
    borderRadius: 8,
    // Thêm shadow nếu cần
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // elevation: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 15,
    color: "#333",
    marginRight: 8,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: "600",
  },
  editButton: {
    marginLeft: "auto", // đẩy icon sang phải
  },
  address: {
    fontSize: 14,
    color: "#333",
  },
});
