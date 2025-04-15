import { Stack } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function ScreenLayout() {
    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
