// src/screens/OrderTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
  LayoutChangeEvent,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import HeaderWithBack from '@/components/custom/headerBack';
import { BASE_URL, get_oder_status, Im_URL, Create_payment } from '../../../api';

const tabs = [
  { label: 'Chờ xác nhận', id: 'pendingConfirmation', apiStatus: 'cho_xac_nhan' },
  { label: 'Chờ lấy hàng', id: 'waitingPickup', apiStatus: 'cho_lay_hang' },
  { label: 'Đang giao hàng', id: 'delivering', apiStatus: 'dang_giao' },
  { label: 'Đã giao', id: 'delivered', apiStatus: 'da_giao' },
  { label: 'Hoàn thành', id: 'completed', apiStatus: 'hoan_thanh' },
  { label: 'Hủy', id: 'cancelled', apiStatus: 'huy' },
];

export default function OrderTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabsScrollViewRef = useRef<ScrollView>(null);
  const [tabsMeasurements, setTabsMeasurements] = useState<Record<string, { x: number; width: number }>>({});

  // Fetch orders when activeTab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Chưa đăng nhập');
        const apiStatus = tabs.find(t => t.id === activeTab)!.apiStatus;
        const res = await fetch(`${BASE_URL}${get_oder_status}?status=${apiStatus}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Lỗi server');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (e: any) {
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      fetchData().then(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      });
    });
  }, [activeTab]);

  // Handle tab press scroll
  const handleTabPress = (tabId: string) => {
    if (tabsScrollViewRef.current && tabsMeasurements[tabId]) {
      const { x } = tabsMeasurements[tabId];
      tabsScrollViewRef.current.scrollTo({ x: x - 10, animated: true });
    }
    setActiveTab(tabId);
  };

  const onTabLayout = (tabId: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabsMeasurements(prev => ({ ...prev, [tabId]: { x, width } }));
  };

  /** Call Create_payment and navigate to PaymentScreen */
  const handlePay = async (orderId: string, amount: number) => {
    // Loại bỏ phần thập phân của số tiền
    const intAmount = Math.floor(amount);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Bạn cần đăng nhập');

      const res = await fetch(`${BASE_URL}${Create_payment}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          amount: intAmount,
          orderInfo: `Thanh toan don ${orderId}`,
          orderType: 'other',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.code !== '00') {
        throw new Error(data.message || 'Tạo giao dịch thất bại');
      }

      router.push({
        pathname: '/paymentScreen',
        params: { paymentUrl: data.data, order_Id: orderId },
      });
    } catch (e: any) {
      ToastAndroid.show(e.message, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Đơn hàng của bạn" />

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          ref={tabsScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              onLayout={onTabLayout(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#FF6600" />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {orders.length === 0 ? (
            <View style={{ padding: 20 }}><Text>Không có đơn hàng</Text></View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={o => o.orderId}
              contentContainerStyle={{ padding: 10 }}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  <Text style={styles.orderId}>Đơn: {item.orderId}</Text>
                  <Text style={styles.orderTotal}>
                    Tổng: {Math.floor(item.purchasePrice).toLocaleString('vi-VN')}₫
                  </Text>
                  {item.products.map((p: any, idx: number) => (
                    <View key={idx} style={styles.productRow}>
                      <Image source={{ uri: Im_URL + p.firstImage }} style={styles.thumbnail} />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{p.name} x{p.variants[0].quantity}</Text>
                        <Text style={styles.productPrice}>{Math.floor(p.variants[0].price).toLocaleString('vi-VN')}₫</Text>
                      </View>
                    </View>
                  ))}
                  {item.payment_status === 'chua_thanh_toan' && (
                    <TouchableOpacity
                      style={styles.payButton}
                      onPress={() => handlePay(item.orderId, item.purchasePrice)}
                    >
                      <Text style={styles.payButtonText}>Thanh toán</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#FF8000',
    backgroundColor: '#fff',
  },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 10 },
  tab: { paddingVertical: 12, paddingHorizontal: 15 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF8000' },
  tabText: { color: 'gray', fontSize: 16 },
  activeTabText: { color: '#000', fontWeight: 'bold' },

  orderCard: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  orderId: { fontWeight: 'bold', marginBottom: 6 },
  orderTotal: { color: '#FF6600', marginBottom: 8 },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 4, marginRight: 12 },
  productInfo: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 14, color: '#333' },
  productPrice: { fontSize: 14, color: '#FF6600', fontWeight: 'bold' },

  payButton: {
    marginTop: 10,
    backgroundColor: '#FF6600',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: '600' },
});