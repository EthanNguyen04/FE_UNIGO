import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import AddressItem from '@/components/address/item_address';
import AddAddressModal from '@/components/address/modal_address';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const AddressScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [addresses, setAddresses] = useState([
    {
      name: 'ThangNV',
      phone: '0999999999',
      address: 'Xuân Phương, Nam Từ Liêm, Hà Nội',
    },
  ]);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleAddPress = () => {
    setEditIndex(null);
    setName('');
    setPhone('');
    setAddress('');
    setModalVisible(true);
  };

  const handleEdit = (index: number) => {
    const selected = addresses[index];
    setName(selected.name);
    setPhone(selected.phone);
    setAddress(selected.address);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleSaveAddress = (data: { name: string; phone: string; address: string }) => {
    if (editIndex !== null) {
      const updated = [...addresses];
      updated[editIndex] = data;
      setAddresses(updated);
    } else {
      setAddresses(prev => [...prev, data]);
    }

    setModalVisible(false);
    setName('');
    setPhone('');
    setAddress('');
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#FF8000" />
            </TouchableOpacity>
            <Text style={styles.title}>ĐỊA CHỈ</Text>
          </View>

          {/* Thêm địa chỉ */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>Thêm Địa Chỉ</Text>
          </TouchableOpacity>

          {/* Danh sách địa chỉ */}
          {addresses.map((item, index) => (
            <AddressItem
              key={index}
              name={item.name}
              phone={item.phone}
              address={item.address}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}

          {/* Modal thêm/sửa địa chỉ */}
          <AddAddressModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveAddress}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            editMode={editIndex !== null}
          />
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop:
      Platform.OS === 'android' && StatusBar.currentHeight
        ? StatusBar.currentHeight * 0.7
        : 10,
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.023,
    marginHorizontal: width * 0.025,
  },
  title: {
    marginLeft: width * 0.025,
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#FF8000',
  },
  addButton: {
    backgroundColor: '#FDCAB5',
    paddingVertical: height * 0.025,
    marginHorizontal: width * 0.035,
    borderRadius: width * 0.04,
    marginTop: height * 0.025,
  },
  addButtonText: {
    textAlign: 'center',
    color: '#D36C10',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AddressScreen;