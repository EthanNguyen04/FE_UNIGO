
import { View, Text, StyleSheet } from "react-native";

export default function OTPScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình OTP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
});
