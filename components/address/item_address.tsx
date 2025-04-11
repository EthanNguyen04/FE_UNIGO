import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface AddressItemProps {
  name: string;
  phone: string;
  address: string;
  onEdit?: () => void;
  onDelete?: () => void; // Thêm prop onDelete
}

const AddressItem: React.FC<AddressItemProps> = ({
  name,
  phone,
  address,
  onEdit,
  onDelete,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => setModalVisible(true)}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>
                {name} | {phone}
              </Text>
              <Text style={styles.address}>{address}</Text>
            </View>
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>

      {/* Modal xác nhận xóa */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Bạn có chắc muốn xóa địa chỉ này?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(false);
                  onDelete?.();
                }}
              >
                <Text style={styles.confirmText}>Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF8000',
    padding: height * 0.025,
    borderRadius: width * 0.017,
    marginHorizontal: width * 0.025,
    marginTop: height * 0.025,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontWeight: 'bold',
    color: '#fff',
  },
  address: {
    color: '#fff',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ff3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.17,
    height: height *0.1,
    marginVertical: height * 0.025,
    borderRadius: width * 0.017,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: width * 0.017,
    padding: width * 0.046,
    width: width * 0.8,
    elevation: 10,
  },
  modalText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: width * 0.025,
    borderRadius: width * 0.017,
    backgroundColor: '#ccc',
    flex: 1,
    marginRight: width * 0.025,
  },
  confirmButton: {
    padding: width * 0.025,
    borderRadius: width * 0.017,
    backgroundColor: '#ff3333',
    flex: 1,
  },
  cancelText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddressItem;