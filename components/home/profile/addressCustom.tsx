import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, getAllAddresses } from "../../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddAddress, { AddAddressData } from "@/components/screen/AddAddress";

export interface AddressCustomProps {
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AddressCustom: React.FC<AddressCustomProps> = ({ onClose }) => {
  const [addressList, setAddressList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<string>("");

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Thông báo", "Không tìm thấy token, vui lòng đăng nhập lại");
        setLoading(false);
        return;
      }
      const response = await fetch(`${BASE_URL}${getAllAddresses}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const addressesWithId = data.addresses.map((item: any, index: number) => ({
          id: `${item._id || index}`,
          addressDetail: item.address,
          phone: item.phone,
        }));
        setAddressList(addressesWithId);
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Có lỗi xảy ra khi tải địa chỉ");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditAddress = (addressId: string) => {
    const item = addressList.find((i) => i.id === addressId);
    if (item) {
      setAddressToEdit(item.addressDetail);
      setShowAddDialog(true);
    } else {
      Alert.alert("Thông báo", `Không tìm thấy địa chỉ có id: ${addressId}`);
    }
  };

  const handleAddNewAddress = () => {
    setAddressToEdit("");
    setShowAddDialog(true);
  };

  const handleSaveNewAddress = (newAddress: AddAddressData) => {
    if (addressToEdit) {
      setAddressList((prev) =>
        prev.map((item) =>
          item.addressDetail === addressToEdit
            ? {
                ...item,
                addressDetail: `${newAddress.addressDetail}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.city}`,
                phone: newAddress.phone,
              }
            : item
        )
      );
    } else {
      setAddressList((prev) => [
        ...prev,
        {
          id: `${prev.length}`,
          addressDetail: `${newAddress.addressDetail}, ${newAddress.ward}, ${newAddress.district}, ${newAddress.city}`,
          phone: newAddress.phone,
        },
      ]);
    }
    setShowAddDialog(false);
    fetchAddresses();
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.addAddressButton} onPress={handleAddNewAddress}>
            <Text style={styles.addAddressButtonText}>Thêm Địa Chỉ</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#FF8000" />
          ) : (
            <FlatList
              data={addressList}
              renderItem={({ item }) => (
                <View style={styles.addressItem}>
                  <View style={styles.addressInfo}>
                    <Text style={styles.namePhoneText}>{item.phone}</Text>
                    <Text style={styles.addressDetailText}>{item.addressDetail}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditAddress(item.id)}>
                    <Ionicons name="pencil-outline" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>Chưa có địa chỉ</Text>}
            />
          )}

          <AddAddress
            visible={showAddDialog}
            onCancel={() => setShowAddDialog(false)}
            onSave={handleSaveNewAddress}
            existingAddress={addressToEdit}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close-circle" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      
    </Modal>
  );
};

const styles = StyleSheet.create({
 
  container: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
  },
  addAddressButton: {
    backgroundColor: "#FFDAB9",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    paddingVertical: 10,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressInfo: {
    flex: 1,
  },
  namePhoneText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  addressDetailText: {
    fontSize: 14,
    color: "#fff",
  },
  editButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 20,
  },
  closeIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default AddressCustom;
