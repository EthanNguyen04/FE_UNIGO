import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderWithBackProps {
  title: string;
  onBackPress?: () => void;
}

const HeaderWithBack: React.FC<HeaderWithBackProps> = ({ title, onBackPress }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="rgb(72, 61, 139)" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    // Để tiêu đề được căn giữa, bạn có thể thêm marginRight để tạo khoảng cách với nút bên phải (nếu có)
    marginRight: 30,
    color: "rgb(72, 61, 139)"
  },
});

export default HeaderWithBack;
