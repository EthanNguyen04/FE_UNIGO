import { Stack } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

export default function AuthLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
