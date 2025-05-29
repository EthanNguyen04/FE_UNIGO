import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, getAllAddresses } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddAddress, { AddAddressData } from "@/components/screen/AddAddress";
import HeaderWithBack from "@/components/custom/headerBack";

export default function AddressScreen() {
  const [addressList, setAddressList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<string>("");

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
      if (response.status === 200) {
        const data = await response.json();
        const addressesWithId = data.addresses.map((item: any, index: number) => ({
          id: `${index}`,
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
    const addressItem = addressList.find((item) => item.id === addressId);
    if (addressItem) {
      setAddressToEdit(addressItem.addressDetail);
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
    if (addressToEdit && addressToEdit.trim() !== "") {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Địa chỉ của bạn" />

      <TouchableOpacity style={styles.addAddressButton} onPress={handleAddNewAddress}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addAddressButtonText}>Thêm địa chỉ mới</Text>
      </TouchableOpacity>

      <FlatList
        data={addressList}
        renderItem={({ item }: any) => (
          <View style={styles.addressItem}>
            <View style={styles.addressInfo}>
              <View style={styles.row}>
                <Ionicons name="call-outline" size={16} color="#555" />
                <Text style={styles.phoneText}>{item.phone}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={16} color="#555" />
                <Text style={styles.addressText}>{item.addressDetail}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditAddress(item.id)}>
              <Ionicons name="pencil-outline" size={20} color="#FF8000" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>}
      />

      <AddAddress
        visible={showAddDialog}
        onCancel={() => setShowAddDialog(false)}
        onSave={handleSaveNewAddress}
        existingAddress={addressToEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addAddressButton: {
    flexDirection: "row",
    backgroundColor: "#FF8000",
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInfo: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneText: {
    fontSize: 15,
    color: "#333",
  },
  addressText: {
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
  editButton: {
    padding: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 30,
  },
});