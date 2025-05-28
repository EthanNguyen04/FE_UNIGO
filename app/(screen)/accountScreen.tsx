import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL, get_profile, Im_URL, updateProfile } from "../../api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderWithBack from '@/components/custom/headerBack';

const IMAGE_SIZE = 80;

export default function AccountScreen() {
  const [avatar, setAvatar] = useState(''); // avatar từ server sẽ là path tương đối
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageLoading, setImageLoading] = useState(true); // trạng thái loading cho ảnh

  // State cho các modal
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [newName, setNewName] = useState(name);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch thông tin người dùng khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${BASE_URL}${get_profile}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status !== 200) {
          Alert.alert('Error', 'Không thể tải thông tin người dùng');
          return;
        }
        const data = await response.json();
        // Lưu lại avatar, name, email từ server.
        // Giả sử server trả về avatar là một path tương đối, ví dụ: "/uploads/avatar123.jpg"
        setAvatar(data.avatar);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        Alert.alert('Error', 'Có lỗi xảy ra, vui lòng thử lại sau');
      }
    };

    fetchUserProfile();
  }, []);

  // Hàm cập nhật thông tin người dùng (PUT /updateProfile)
  const updateUserProfileApi = async (data: any) => {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.currentPassword) formData.append("currentPassword", data.currentPassword);
    if (data.newPassword) formData.append("newPassword", data.newPassword);

    // Nếu chọn avatar mới từ thư viện thì URI của nó sẽ có dạng "file://..."
    if (data.avatar && data.avatar.startsWith("file://")) {
      const uriParts = data.avatar.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append("avatar", {
        uri: data.avatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`
      } as any);
    }

    try {
      const response = await fetch(`${BASE_URL}${updateProfile}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          // Không cần set Content-Type vì fetch sẽ tự quản lý multipart/form-data boundary.
        },
        body: formData,
      });
      const resData = await response.json();
      if (response.status === 200) {
        Alert.alert("Thành công", resData.message);
      } else {
        Alert.alert("Lỗi", resData.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  // Hàm chọn ảnh avatar bằng ImagePicker
  const handleChangeAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập từ chối', 'Chúng tôi cần quyền truy cập vào thư viện ảnh để thay đổi avatar.');
        return;
      }
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatar = result.assets[0].uri;
        // Với ảnh mới chọn, đây là file local nên không ghép Im_URL
        setAvatar(newAvatar);
        // Gọi API update avatar (gửi URI file local qua formData)
        await updateUserProfileApi({ avatar: newAvatar });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh!');
    }
  };

  // Hàm mở modal chỉnh sửa tên
  const handlePressName = () => {
    setNewName(name);
    setShowEditNameModal(true);
  };

  // Lưu tên mới và gọi API cập nhật
  const saveNewName = async () => {
    setName(newName);
    setShowEditNameModal(false);
    await updateUserProfileApi({ full_name: newName });
  };

  // Hàm mở modal đổi mật khẩu
  const handlePressPassword = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePasswordModal(true);
  };

  // Lưu mật khẩu mới và gọi API cập nhật mật khẩu
  const saveNewPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không trùng khớp.");
      return;
    }
    await updateUserProfileApi({
      currentPassword: oldPassword,
      newPassword: newPassword
    });
    Alert.alert("Thành công", "Đã đổi mật khẩu thành công!");
    setShowChangePasswordModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cố định, luôn hiển thị ở trên cùng */}
      <HeaderWithBack title="Thông tin của bạn" />
      {/* Phần header với ảnh avatar */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleChangeAvatar}>
          <View style={styles.imageWrapper}>
            <Image
              // Nếu avatar là file local, sử dụng URI đó; nếu không, ghép Im_URL vào trước
              source={
                avatar
                  ? { uri: avatar.startsWith("file://") ? avatar : `${Im_URL}${avatar}` }
                  : require("../../assets/images/avatar.png")
              }
              style={styles.avatar}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="small"
                color="#fff"
              />
            )}
          </View>
          <Text style={styles.tapToChange}>Chạm để thay đổi</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin tài khoản */}
      <ScrollView contentContainerStyle={styles.accountInfoContainer}>
        <TouchableOpacity style={styles.row} onPress={handlePressName}>
          <Text style={styles.label}>TÊN</Text>
          <View style={styles.rightSection}>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.row, styles.disabledRow]}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.rightSection}>
            <Text style={[styles.value, styles.disabledText]}>{email}</Text>
            <Text style={[styles.arrow, styles.disabledText]}>{'>'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.row} onPress={handlePressPassword}>
          <Text style={styles.label}>MẬT KHẨU</Text>
          <View style={styles.rightSection}>
            <Text style={styles.value}>******</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal sửa tên */}
      <Modal
        visible={showEditNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sửa Tên</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nhập tên mới"
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowEditNameModal(false)}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonPrimary]} onPress={saveNewName}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        visible={showChangePasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đổi Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setShowChangePasswordModal(false)}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.modalButtonPrimary]} onPress={saveNewPassword}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    backgroundColor: '#FF8C00',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageWrapper: {
    width: IMAGE_SIZE + 8,
    height: IMAGE_SIZE + 8,
    borderRadius: (IMAGE_SIZE + 8) / 2,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  avatar: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToChange: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  accountInfoContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginRight: 8,
    flexShrink: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#bbb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  modalButtonPrimary: {
    backgroundColor: '#FF8C00',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  disabledRow: {
    opacity: 0.5, // Làm mờ
  },
  disabledText: {
    color: '#999',
  },
});
