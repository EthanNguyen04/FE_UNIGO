// src/screens/OrderTab.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  StatusBar,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import HeaderWithBack from '@/components/custom/headerBack';
import { BASE_URL, get_oder_status, Im_URL, Create_payment } from '../../../api';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const tabs = [
  { label: 'Chờ xác nhận', id: 'pendingConfirmation', apiStatus: 'cho_xac_nhan'},
  { label: 'Chờ lấy hàng', id: 'waitingPickup', apiStatus: 'cho_lay_hang'},
  { label: 'Đang giao hàng', id: 'delivering', apiStatus: 'dang_giao'},
  { label: 'Đã giao', id: 'delivered', apiStatus: 'da_giao'},
  { label: 'Hoàn thành', id: 'completed', apiStatus: 'hoan_thanh'},
  { label: 'Hủy', id: 'cancelled', apiStatus: 'huy'},
];

export default function OrderTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabsScrollViewRef = useRef<ScrollView>(null);
  const [tabsMeasurements, setTabsMeasurements] = useState<Record<string, { x: number; width: number }>>({});

  const fetchData = useCallback(async () => {
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
  }, [activeTab]);

  // Fetch orders when activeTab changes
  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -20, duration: 200, useNativeDriver: true })
      ]).start(() => {
        fetchData().then(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true })
          ]).start();
        });
      });
    }, [fetchData])
  );

  // Handle tab press scroll
  const handleTabPress = (tabId: string) => {
    if (tabsScrollViewRef.current && tabsMeasurements[tabId]) {
      const { x } = tabsMeasurements[tabId];
      tabsScrollViewRef.current.scrollTo({ x: x - 20, animated: true });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cho_xac_nhan': return '#FFB800';
      case 'cho_lay_hang': return '#00BCD4';
      case 'dang_giao': return '#2196F3';
      case 'da_giao': return '#4CAF50';
      case 'hoan_thanh': return '#8BC34A';
      case 'huy': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    const tab = tabs.find(t => t.apiStatus === status);
    return tab ? tab.label : status;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
    </View>
  );

  const renderOrderCard = ({ item, index }: { item: any; index: number }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [-20, 0],
            outputRange: [index * 5 - 20, 0],
          })
        }
      ]
    };

    return (
      <Animated.View style={[styles.orderCard, animatedStyle]}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
            <Text style={styles.orderId}>{item.orderId}</Text>
          </View>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          {item.products.map((p: any, idx: number) => (
            <View key={idx} style={styles.productRow}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: Im_URL + p.firstImage }} 
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {p.name}
                </Text>
                <View>
                  <Text style={styles.productQuantity}>
                    Số lượng: {p.variants[0].quantity}
                  </Text>
                  <Text style={styles.productPrice}>
                    Giá: {Math.floor(p.variants[0].price).toLocaleString('vi-VN')}₫
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.orderTotal}>
              {Math.floor(item.purchasePrice).toLocaleString('vi-VN')}₫
            </Text>
          </View>
          
          {item.payment_status === 'chua_thanh_toan' && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => handlePay(item.orderId, item.purchasePrice)}
              activeOpacity={0.8}
            >
              <Text style={styles.payButtonText}>Thanh toán ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderWithBack title="Đơn hàng của bạn" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            ref={tabsScrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
            style={styles.tabsScrollView}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab.id)}
                onLayout={onTabLayout(tab.id)}
                style={[
                  styles.tab,
                  activeTab === tab.id && styles.activeTab
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B3C" />
              <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
            </View>
          ) : orders.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={orders}
              keyExtractor={o => o.orderId}
              renderItem={renderOrderCard}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 1,
  },
  
  // Tabs Styling
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabsScrollView: {
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  tab: {
    // paddingVertical: 5,
    // paddingHorizontal: 20,
    width: 150,
    height: 48,
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(210, 207, 207, 0.8)',
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#FF6B3C',
    borderColor: '#FF6B3C',
    shadowColor: '#FF6B3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Content
  contentContainer: {
    flex: 1,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },

  // List
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },

  // Order Card
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#FAFBFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Products Section
  productsSection: {
    padding: 16,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#F8F9FA',
  },
  productInfo: {
    flex: 1,
    paddingTop: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 22,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B3C',
  },

  // Order Footer
  orderFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FAFBFC',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgb(255, 0, 0)',
  },
  payButton: {
    backgroundColor: 'rgb(0, 140, 255)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});