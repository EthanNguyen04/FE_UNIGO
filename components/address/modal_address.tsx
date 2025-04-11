import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface AddAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; address: string }) => void;
  name: string;
  setName: (text: string) => void;
  phone: string;
  setPhone: (text: string) => void;
  address: string;
  setAddress: (text: string) => void;
  editMode?: boolean;
}

const AddAddressModal = ({
  visible,
  onClose,
  onSave,
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  editMode = false, // Mặc định là false nếu không truyền
}: AddAddressModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </Text>

          <TextInput
            placeholder="Họ tên"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Địa chỉ chi tiết"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave({ name, phone, address })}
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8000',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#FF8000',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  closeButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
});

export default AddAddressModal;