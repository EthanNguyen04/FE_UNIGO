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

export default function AddressScreen() {
  const [addressList, setAddressList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  // Để sửa địa chỉ, có thể truyền existingAddress từ danh sách hiện có
  const [addressToEdit, setAddressToEdit] = useState<string>("");

  // Hàm lấy danh sách địa chỉ từ API
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
        // Ví dụ API trả về: { addresses: [{ address: "...", phone: "..." }, ...] }
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
    // Tìm item trong danh sách theo id
    const addressItem = addressList.find((item) => item.id === addressId);
    if (addressItem) {
      // Đặt giá trị địa chỉ cần sửa vào state để truyền qua component AddAddress
      setAddressToEdit(addressItem.addressDetail);
      setShowAddDialog(true);
    } else {
      Alert.alert("Thông báo", `Không tìm thấy địa chỉ có id: ${addressId}`);
    }
  };

  const handleAddNewAddress = () => {
    // Khi thêm mới thì không truyền oldAddress (để backend hiểu là thêm mới)
    setAddressToEdit("");
    setShowAddDialog(true);
  };

  // Sau khi lưu xong, gọi fetchAddresses để làm mới dữ liệu từ server
  const handleSaveNewAddress = (newAddress: AddAddressData) => {
    // Nếu đang sửa địa chỉ (addressToEdit có giá trị), cập nhật item trong danh sách cục bộ
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
      // Nếu thêm mới, gán id mới theo độ dài mảng hiện có
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
    // Reload dữ liệu từ API để đảm bảo đồng bộ với backend
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
      <TouchableOpacity style={styles.addAddressButton} onPress={handleAddNewAddress}>
        <Text style={styles.addAddressButtonText}>Thêm Địa Chỉ</Text>
      </TouchableOpacity>

      <FlatList
        data={addressList}
        renderItem={({ item }: any) => (
          <View style={styles.addressItem}>
            <View style={styles.addressInfo}>
              <Text style={styles.namePhoneText}>{item.phone}</Text>
              <Text style={styles.addressDetailText}>{item.addressDetail}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditAddress(item.id)}
            >
              <Ionicons name="pencil-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có địa chỉ</Text>}
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
    paddingTop: 20,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addAddressButton: {
    backgroundColor: "#FFDAB9",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
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
});
