import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export interface SettingItem {
  id: string;
  title: string;
}

const defaultSettings: SettingItem[] = [
  { id: "1", title: "Tài Khoản & Bảo Mật" },
  { id: "2", title: "Địa Chỉ" },
];

const SettingComponent: React.FC = () => {
  const router = useRouter();

  const handlePressSetting = (title: string) => {
    if (title === "Tài Khoản & Bảo Mật") {
      router.push("/accountScreen");
    } else if (title === "Địa Chỉ") {
      router.push("/addressScreen");
    } else {
      alert(`Chức năng đang phát triển: ${title}`);
    }
  };

  return (
    <View style={styles.card}>
      <FlatList
        data={defaultSettings}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handlePressSetting(item.title)}
            activeOpacity={0.7}
          >
            <Text style={styles.settingText}>{item.title}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#999" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6B00",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#f2f2f2",
    marginLeft: 4,
  },
});

export default SettingComponent;