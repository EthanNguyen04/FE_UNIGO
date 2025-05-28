"use client";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image as RNImage,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const placeholderImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

export default function NotificationDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const title = Array.isArray(params.title) ? params.title[0] : params.title || "";
  const content = Array.isArray(params.content) ? params.content[0] : params.content || "";
  const time = Array.isArray(params.time) ? params.time[0] : params.time || "";
  const imageParam = Array.isArray(params.image) ? params.image[0] : params.image || "";

  const displayImage = imageParam.length > 0 ? imageParam : placeholderImage;

  return (
    <View style={styles.container}>
      {/* Header with Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="rgb(72, 61, 139)" />
          <Text style={styles.backText}>Thông báo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RNImage
          source={{ uri: displayImage }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.titleRow}>
          <MaterialIcons name="notifications-active" size={28} color="rgb(72, 61, 139)" style={{ marginRight: 8 }} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.timeRow}>
          <MaterialIcons name="schedule" size={18} color="#999" style={{ marginRight: 4 }} />
          <Text style={styles.time}>{time}</Text>
        </View>

        <Text style={styles.sectionLabel}>Nội dung</Text>
        <View style={styles.contentRow}>
          <Text style={styles.content}>{content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: "rgb(72, 61, 139)",
    marginLeft: 6,
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: screenWidth - 40,
    height: (screenWidth - 40) * 0.55,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#ddd",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "rgb(72, 61, 139)",
    flexShrink: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  time: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
    flex: 1,
  },
});