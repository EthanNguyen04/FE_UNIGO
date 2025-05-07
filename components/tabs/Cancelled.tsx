// components/PendingConfirmation.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Cancelled() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Danh sách đơn hàng hủy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  text: { fontSize: 18 },
});
