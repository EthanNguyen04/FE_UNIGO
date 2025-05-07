import React, { useEffect, createContext, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, update_expo_token, post_noti_guest } from '../api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext({});
export const useNotification = () => useContext(NotificationContext);

const EXPO_TOKEN_KEY = 'expo_tkn';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // 1) Đăng ký channel & permissions, rồi lấy token
    const registerForPushNotificationsAsync = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Không thể lấy quyền thông báo!');
        return;
      }

      // Thực sự đăng ký và xử lý token
      const register = async () => {
        const { data: expoToken } = await Notifications.getExpoPushTokenAsync();
        console.log('🔥 Expo Push Token:', expoToken);

        if (!expoToken) {
          console.log('Chưa có token, thử lại sau 2s');
          setTimeout(register, 2000);
          return;
        }

        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem(EXPO_TOKEN_KEY, expoToken);

        // Lấy token user & inApp flag
        const rawToken = await AsyncStorage.getItem('token');
        const token = rawToken?.trim() || null;
        const inApp = (await AsyncStorage.getItem('InApp'))?.trim() ?? 'false';

        // --- USER ĐÃ LOGIN -> update_expo_token ---
if (token && inApp === 'true') {
  try {
    const res = await fetch(`${BASE_URL}${update_expo_token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expo_tkn: expoToken }),
    });

    const text = await res.text();

    if (!res.ok) {
      console.log(`❌ update_expo_token lỗi [${res.status}]:`, text);
    } else {
      console.log('✅ update_expo_token:', JSON.parse(text));
    }

  } catch (e) {
    console.log('❌ Lỗi fetch update_expo_token:', e);
  }
} 
// --- GUEST ---
else {
  console.log('👤 Đang là guest, sẽ gọi post_noti_guest sau 5s');
  setTimeout(async () => {
    const guestToken = await AsyncStorage.getItem(EXPO_TOKEN_KEY);
    if (!guestToken) {
      console.warn('⚠️ Chưa có Expo token trong storage');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}${post_noti_guest}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expo_tkn: guestToken }),
      });

      const text = await res.text();

      if (!res.ok) {
        console.log(`❌ post_noti_guest lỗi [${res.status}]:`, text);
      } else {
        console.log('✅ post_noti_guest:', JSON.parse(text));
      }

    } catch (e) {
      console.error('❌ Lỗi fetch post_noti_guest:', e);
    }
  }, 3000);
}
      };

      register();
    };

    // 2) Luôn hiển thị notification đến ngay cả khi app đang chạy
    const receivedSub = Notifications.addNotificationReceivedListener(noti => {
      const { title, subtitle, body, data } = noti.request.content;
      Notifications.presentNotificationAsync({
        title: title ?? undefined,
        subtitle: subtitle ?? undefined,
        body: body ?? undefined,
        data,
        sound: 'default',
      });
    });

    // 3) Khi user tap notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(() => {
      router.push('/home/noti_nav');
    });

    // 4) Khi app mở từ killed state qua notification
    const checkInitial = async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) {
        router.push('/home/noti_nav');
      }
    };

    registerForPushNotificationsAsync();
    checkInitial();

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [router]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
