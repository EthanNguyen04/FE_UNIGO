import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeliveryInfoProps {
  phoneNumber?: string;
  address?: string;
  onEdit?: () => void;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
  phoneNumber = "",
  address,
  onEdit = () => {},
}) => {
  const hasAddress = Boolean(address && address.trim().length > 0);

  return (
    <TouchableOpacity style={styles.deliveryContainer}  onPress={onEdit}>
      {/* Icon & tiêu đề */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={20} color="#FF6600" />
        <Text style={styles.locationText}>Địa chỉ nhận hàng</Text>
      </View>

      {/* Tên khách hàng & SĐT  */}
      <View style={styles.row}>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Địa chỉ hoặc placeholder */}
      <Text style={[styles.address, !hasAddress && styles.placeholderText]}>
        {hasAddress ? address : "Hãy chọn địa chỉ nhận hàng"}
      </Text>
    </TouchableOpacity>
  );
};

export default DeliveryInfo;

const styles = StyleSheet.create({
  deliveryContainer: {
    backgroundColor: "#FFFFFF",
    margin: 10,
    padding: 12,
    borderRadius: 8,
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
    marginLeft: "auto",
        padding: 4,           // thêm padding để vùng chạm rộng hơn
   justifyContent: "center",
   alignItems: "center",
  },
  address: {
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    color: "#888",
    fontStyle: "italic",
  },
});
