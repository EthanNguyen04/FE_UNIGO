import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export interface SettingItem {
  id: string;
  title: string;
}

// Mảng settings được định nghĩa trực tiếp trong component
const defaultSettings: SettingItem[] = [
  { id: "1", title: "Tài Khoản & Bảo Mật" },
  { id: "2", title: "Địa Chỉ" },
  { id: "3", title: "Tài Khoản Thanh Toán" },
  { id: "4", title: "Đăng Xuất" },
];

const SettingComponent: React.FC = () => {
  const router = useRouter();

  const handlePressSetting = (title: string) => {
    // Ví dụ chuyển màn hình theo title, bạn có thể chuyển theo id hoặc tham số khác.
    if (title === "Đăng Xuất") {
      // Ở đây bạn có thể thực hiện logout rồi điều hướng về màn hình đăng nhập, ví dụ:
      router.push("/login");
    } else if (title === "Tài Khoản & Bảo Mật") {
      router.push("/accountScreen");
    } else if (title === "Địa Chỉ") {
      router.push("/addressScreen");
    } else if (title === "Tài Khoản Thanh Toán") {
      //router.push("/settings/payment");
    } else {
      // Nếu không định nghĩa route thì hiển thị thông báo
      alert(`Chức năng đang phát triển: ${title}`);
    }
  };

  return (
    <View style={styles.card}>
      <FlatList
        data={defaultSettings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => handlePressSetting(item.title)}
          >
            <Text style={styles.settingText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SettingComponent;
