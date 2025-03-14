import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, Stack } from 'expo-router';

export default function NotiScreen() {
  return (
    <View style={styles.container}>
      <Link href="/(product)/flash_sale/flash_sale_screen">
      <Text>Chuyển đến Flash Sale</Text>
    </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  }
});
