import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, getAllAddresses } from "../../api"; // chỉnh đường dẫn phù hợp
import DeliveryInfo from "./info_order"; // chỉnh đường dẫn phù hợp
import AddAddress, { AddAddressData } from "@/components/screen/AddAddress";

// Định nghĩa kiểu AddressItem
export type AddressItem = {
  id: string;
  addressDetail: string;
  phone: string;
};

interface DeliveryAddressPickerProps {
  onSelect: (address: AddressItem) => void;
}

export default function DeliveryAddressPicker({ onSelect }: DeliveryAddressPickerProps) {
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<AddressItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${BASE_URL}${getAllAddresses}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const list = data.addresses.map((item: any, idx: number) => ({
          id: idx.toString(),
          addressDetail: item.address,
          phone: item.phone,
        }));
        setAddressList(list);
      }
    } catch {
      // xử lý lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleEdit = () => {
    if (addressList.length === 0) {
      setShowAddDialog(true);
    } else {
      setModalVisible(true);
    }
  };

  const selectAddress = (item: AddressItem) => {
    setSelected(item);
    setModalVisible(false);
    onSelect(item);
  };

  const handleSaveNewAddress = (newData: AddAddressData) => {
    setShowAddDialog(false);
    fetchAddresses();
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <DeliveryInfo
        phoneNumber={selected?.phone ?? ""}
        address={selected?.addressDetail}
        onEdit={handleEdit}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF8000" />
            ) : (
              <FlatList
                data={addressList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectAddress(item)}
                  >
                    <Text style={styles.modalItemText}>{item.addressDetail}</Text>
                    <Text style={styles.modalItemSub}>{item.phone}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
              />
            )}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={32} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AddAddress
        visible={showAddDialog}
        onCancel={() => setShowAddDialog(false)}
        onSave={handleSaveNewAddress}
        existingAddress={""}
      />
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { width: "100%"},
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#FF6600", marginBottom: 12 },
  listContent: { paddingBottom: 16 },
  modalItem: { paddingVertical: 10 },
  modalItemText: { fontSize: 14, color: "#333" },
  modalItemSub: { fontSize: 12, color: "#666", marginTop: 4 },
  separator: { height: 1, backgroundColor: "#eee" },
  modalClose: { position: "absolute", top: 8, right: 8 },
});
