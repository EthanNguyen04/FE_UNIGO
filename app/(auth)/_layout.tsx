import { Stack } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper"; // ✅ THÊM

export default function AuthLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PaperProvider> 
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
