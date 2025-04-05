import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image, View, StyleSheet, ImageSourcePropType } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false, // Ẩn tiêu đề tab
        tabBarStyle: styles.tabBarStyle,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require("@/assets/images/home_ic.png")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="like_nav"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require("@/assets/images/like_ic.png")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="noti_nav"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require("@/assets/images/ring_ic.png")} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile_nav"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require("@/assets/images/user_ic.png")} focused={focused} />
          ),
        }}
      />

    </Tabs>

  );
}

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ source, focused }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image source={source} style={{ width: 25, height: 25 }} />
      {focused && <View style={styles.dot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 5, // Đẩy tab bar lên trên
    width: '95%', // Thu nhỏ tab bar
    marginHorizontal: '3%', // Căn giữa bằng margin
    borderRadius: 10, // Bo góc
    backgroundColor: '#FFFAF5',
    paddingHorizontal: 5, // Tạo khoảng cách bên trong tab bar
    elevation: 10, // Đổ bóng trên Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#FF8000',
    borderRadius: 3,
    marginTop: 4, // Điều chỉnh khoảng cách với icon
  },
});
