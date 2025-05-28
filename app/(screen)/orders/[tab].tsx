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
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import HeaderWithBack from '@/components/custom/headerBack';
import ReviewModal from '@/components/custom/ReviewModal';
import { BASE_URL, get_oder_status, Im_URL, Create_payment, cancel_order } from '../../../api';

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState<any>(null);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabsScrollViewRef = useRef<ScrollView>(null);
  const [tabsMeasurements, setTabsMeasurements] = useState<Record<string, { x: number; width: number }>>({});
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Danh sách các lý do hủy đơn phổ biến
  const cancelReasons = [
    'Đổi ý không muốn mua nữa',
    'Đặt nhầm sản phẩm',
    'Khác'
  ];

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Chưa đăng nhập');
      const apiStatus = tabs.find(t => t.id === activeTab)!.apiStatus;
      console.log('Đang tải đơn hàng với trạng thái:', apiStatus);
      const res = await fetch(`${BASE_URL}${get_oder_status}?status=${apiStatus}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error(`Lỗi HTTP! mã lỗi: ${res.status}`);
      }
      
      const response = await res.json();
      console.log('Phản hồi API:', response);
      
      if (response?.data?.orders) {
        console.log('Số đơn hàng tìm thấy:', response.data.orders.length);
        setOrders(response.data.orders);
      } else {
        console.log('Không có đơn hàng');
        setOrders([]);
      }
    } catch (e: any) {
      console.error('Lỗi khi tải dữ liệu:', e);
      ToastAndroid.show(e.message || 'Có lỗi xảy ra', ToastAndroid.SHORT);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [activeTab]);

  // Fetch orders when activeTab changes
  useEffect(() => {
    setLoading(true);
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

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Bạn cần đăng nhập');

      // TODO: Implement API call to submit review
      console.log('Submitting review:', {
        orderId: selectedReviewProduct.orderId,
        productId: selectedReviewProduct.productId,
        rating,
        comment,
      });

      ToastAndroid.show('Cảm ơn bạn đã đánh giá!', ToastAndroid.SHORT);
    } catch (e: any) {
      ToastAndroid.show(e.message || 'Có lỗi xảy ra', ToastAndroid.SHORT);
    }
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    // Kiểm tra nếu chưa nhập lý do hủy đơn
    if (!cancelReason.trim()) {
      ToastAndroid.show('Vui lòng nhập lý do hủy đơn', ToastAndroid.SHORT);
      return;
    }

    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Bạn cần đăng nhập');

      console.log("Dữ liệu gửi đi:", {
        orderId: selectedOrderId,
        cancellation_reason: cancelReason,
        url: `${BASE_URL}${cancel_order}`
      });

      // Gọi API hủy đơn hàng
      const response = await fetch(`${BASE_URL}${cancel_order}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrderId,
          cancellation_reason: cancelReason,
        }),
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Kiểm tra response từ server
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || 'Có lỗi xảy ra khi hủy đơn hàng';
        } catch (e) {
          console.log("Lỗi parse JSON:", e);
          errorMessage = 'Có lỗi xảy ra khi hủy đơn hàng';
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.log("Lỗi parse JSON response thành công:", e);
        throw new Error('Không thể xử lý phản hồi từ server');
      }
      
      // Thông báo thành công và cập nhật UI
      ToastAndroid.show(data.message || 'Hủy đơn hàng thành công', ToastAndroid.SHORT);
      setShowCancelDialog(false);
      setCancelReason('');
      fetchData(); // Cập nhật lại danh sách đơn hàng
    } catch (error: any) {
      // Hiển thị thông báo lỗi
      console.log('Lỗi hủy đơn:', error.message);
      ToastAndroid.show(error.message || 'Có lỗi xảy ra', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header với nút back */}
      <HeaderWithBack title="Đơn hàng của bạn" />

      {/* Tab điều hướng */}
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

      {/* Nội dung chính */}
      {loading && !refreshing ? (
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
              refreshing={refreshing}
              onRefresh={onRefresh}
              renderItem={({ item }) => (
                <View style={styles.orderCard}>
                  {/* Header đơn hàng */}
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>#{item.orderId}</Text>
                      <Text style={styles.orderDate}>
                        Tạo: {item.created_at}
                      </Text>
                      {activeTab !== 'pendingConfirmation' && (
                        <Text style={styles.orderDate}>
                          Hoàn thành: {item.updated_at}
                        </Text>
                      )}
                    </View>
                    {activeTab !== 'cancelled' && (
                      <TouchableOpacity 
                        style={styles.shippingInfoButton}
                        onPress={() => setSelectedShippingInfo(item.shipping_address)}
                      >
                        <Text style={styles.shippingInfoButtonText}>Thông tin giao hàng</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Trạng thái đơn hàng */}
                  {activeTab === 'pendingConfirmation' && item.payment_status === 'da_thanh_toan' && (
                    <Text style={styles.shopStatus}>Shop đang chuẩn bị hàng</Text>
                  )}
                  {activeTab === 'cancelled' ? (
                    <Text style={styles.orderStatus}>Đã hủy</Text>
                  ) : (
                    <Text style={styles.orderTotal}>
                      Thanh toán: {Math.floor(item.purchasePrice).toLocaleString('vi-VN')}₫
                    </Text>
                  )}

                  {/* Danh sách sản phẩm trong đơn */}
                  {item.products.map((p: any, idx: number) => (
                    <View key={idx} style={styles.productRow}>
                      <TouchableOpacity 
                        onPress={() => router.push({
                          pathname: '/product_screen',
                          params: { idp: p.productId }
                        })}
                      >
                        <Image source={{ uri: Im_URL + p.firstImage }} style={styles.thumbnail} />
                      </TouchableOpacity>
                      <View style={styles.productInfo}>
                        <View style={styles.productDetails}>
                          <Text style={styles.productName}>{p.name}</Text>
                          <Text style={styles.productVariant}>
                            {p.variants[0].size} - {p.variants[0].color}
                          </Text>
                          <Text style={styles.productVariant}>
                            SL: x{p.variants[0].quantity}
                          </Text>
                          <Text style={styles.productPrice}>
                            {Math.floor(p.variants[0].price).toLocaleString('vi-VN')}₫
                          </Text>
                        </View>
                        {/* Nút đánh giá cho đơn hàng đã hoàn thành */}
                        {activeTab === 'completed' && !p.variants[0].rating && (
                          <TouchableOpacity
                            style={styles.reviewButton}
                            onPress={() => setSelectedReviewProduct({
                              orderId: item.orderId,
                              productId: p.productId,
                              name: p.name,
                              firstImage: p.firstImage,
                              variants: p.variants,
                            })}
                          >
                            <Text style={styles.reviewButtonText}>Đánh giá</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}

                  {/* Lý do hủy đơn */}
                  {activeTab === 'cancelled' && item.cancellation_reason && (
                    <View style={styles.cancellationReason}>
                      <Text style={styles.cancellationReasonText}>
                        Lý do: {item.cancellation_reason}
                      </Text>
                    </View>
                  )}

                  {/* Nút thanh toán và hủy đơn */}
                  {item.payment_status === 'chua_thanh_toan' && activeTab !== 'cancelled' && (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setShowCancelDialog(true);
                          setSelectedOrderId(item.orderId);
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => handlePay(item.orderId, item.purchasePrice)}
                      >
                        <Text style={styles.payButtonText}>Thanh toán</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </Animated.View>
      )}

      {/* Modal đánh giá sản phẩm */}
      <ReviewModal
        visible={!!selectedReviewProduct}
        onClose={() => setSelectedReviewProduct(null)}
        orderId={selectedReviewProduct?.orderId || ''}
        product={selectedReviewProduct || {
          productId: '',
          name: '',
          firstImage: '',
          variants: [{ size: '', color: '' }],
        }}
        onSubmit={handleSubmitReview}
      />

      {/* Modal thông tin giao hàng */}
      <Modal
        visible={!!selectedShippingInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedShippingInfo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin giao hàng</Text>
              <TouchableOpacity onPress={() => setSelectedShippingInfo(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedShippingInfo && (
              <>
                <Text style={styles.modalLabel}>Địa chỉ:</Text>
                <Text style={styles.modalText}>{selectedShippingInfo.address}</Text>
                <Text style={styles.modalLabel}>Số điện thoại:</Text>
                <Text style={styles.modalText}>{selectedShippingInfo.phone}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal hủy đơn hàng */}
      <Modal
        visible={showCancelDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowCancelDialog(false);
          setCancelReason('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelDialogContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Hủy đơn hàng</Text>
                <Text style={styles.modalSubtitle}>#{selectedOrderId}</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowCancelDialog(false);
                  setCancelReason('');
                }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.reasonInputContainer}>
              <Text style={styles.inputLabel}>Lý do hủy đơn</Text>
              <TouchableOpacity 
                style={styles.suggestionButton}
                onPress={() => setShowSuggestions(!showSuggestions)}
              >
                <Text style={styles.suggestionButtonText}>Chọn lý do phổ biến</Text>
                <Text style={styles.suggestionButtonIcon}>{showSuggestions ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              
              {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                  {cancelReasons.map((reason, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => {
                        setCancelReason(reason);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{reason}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <TextInput
                style={styles.reasonInput}
                value={cancelReason}
                onChangeText={setCancelReason}
                placeholder="Nhập lý do hủy đơn của bạn"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.cancelDialogButton]}
                onPress={() => {
                  setShowCancelDialog(false);
                  setCancelReason('');
                }}
              >
                <Text style={styles.dialogButtonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.confirmCancelButton]}
                onPress={handleCancelOrder}
              >
                <Text style={[styles.dialogButtonText, styles.confirmCancelText]}>Xác nhận hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: { 
    fontWeight: '300', 
    fontSize: 12,
    color: '#666',
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  orderStatus: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '500',
  },
  orderTotal: { 
    color: '#FF6600', 
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '400',
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnail: { 
    width: 80, 
    height: 80, 
    borderRadius: 8, 
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  productInfo: { 
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productDetails: {
    flex: 1,
  },
  productName: { 
    fontSize: 15, 
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  productPrice: { 
    fontSize: 14, 
    color: '#FF6600', 
    fontWeight: '400',
    marginTop: 4,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  payButton: {
    backgroundColor: '#FF6600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  payButtonText: { 
    color: '#fff', 
    fontWeight: '500',
    fontSize: 13,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  cancellationReason: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#fff3f3',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  cancellationReasonText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '500',
  },
  shopStatus: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  shippingInfoButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  shippingInfoButtonText: {
    fontSize: 11,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalClose: {
    fontSize: 20,
    color: '#666',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  modalText: {
    fontSize: 15,
    color: '#333',
  },
  reviewButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FF6600',
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '500',
  },
  cancelDialogContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cancelDialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelDialogTitleContainer: {
    flex: 1,
  },
  cancelDialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  reasonInputContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  suggestionWrapper: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 12,
  },
  suggestionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  suggestionButtonText: {
    color: '#666',
    fontSize: 14,
  },
  suggestionButtonIcon: {
    color: '#666',
    fontSize: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  dialogButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelDialogButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmCancelButton: {
    backgroundColor: '#FF6600',
  },
  dialogButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  confirmCancelText: {
    color: 'white',
  },
});