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
      <View style={[styles.iconWrapper, focused && styles.focusedBackground]}>
        <Image
          source={source}
          style={[
            styles.icon,
            { tintColor: focused ? '#fff' : '#C0C0C0' },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 50, // Tăng chiều cao để căn giữa icon đẹp hơn
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'center', // Phân bố đều các tab
    alignItems: 'center', // Căn giữa icon theo chiều dọc
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,

  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, // Cân chỉnh icon trong khung tab bar
  },

  focusedBackground: {
    backgroundColor: 'rgba(255, 55, 0, 1)',
  },

  icon: {
    width: 20,
    height: 20,
  },
});

