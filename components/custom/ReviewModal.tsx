import React, { useState, useEffect } from 'react';
import { BASE_URL, Im_URL, post_rating } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  product: {
    productId: string;
    name: string;
    firstImage: string;
    variants: Array<{
      size: string;
      color: string;
    }>;
  };
  onSubmit: (rating: number, comment: string) => void;
}

export default function ReviewModal({ visible, onClose, orderId, product, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setRating(5);
      setComment('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại để tiếp tục');
        return;
      }

      const requestBody = {
        product_id: product.productId,
        order_id: orderId,
        star: rating,
        content: comment || '',
        product_variant: product.variants[0] ? `${product.variants[0].size}, ${product.variants[0].color}` : ''
      };
      console.log(BASE_URL + post_rating)
      console.log('Review API Request:', {
        url: BASE_URL + post_rating,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: requestBody
      });

      const response = await fetch(BASE_URL + post_rating, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      // Log response details
      console.log('Review API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      // Get response text first
      const responseText = await response.text();
      console.log('Response Text:', responseText);

      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        if (response.status === 400) {
          Alert.alert('Lỗi', 'Vui lòng cung cấp token!');
        } else if (response.status === 401) {
          Alert.alert('Lỗi', 'Token không hợp lệ hoặc đã hết hạn');
        } else if (response.status === 403) {
          Alert.alert('Lỗi', 'Bạn cần đăng nhập để đánh giá sản phẩm');
        } else {
          Alert.alert('Lỗi', 'Máy chủ đang gặp sự cố, vui lòng thử lại sau');
        }
        return;
      }
      
      if (response.ok) {
        onSubmit(rating, comment);
        setRating(5);
        setComment('');
        onClose();
      } else {
        let errorMessage = 'Có lỗi xảy ra khi gửi đánh giá';
        if (data.message) {
          errorMessage = data.message;
        } else if (response.status === 400) {
          if (data.message === 'Thiếu thông tin bắt buộc: product_id, order_id và star là bắt buộc') {
            errorMessage = 'Vui lòng điền đầy đủ thông tin đánh giá';
          } else if (data.message === 'Số sao đánh giá phải từ 1 đến 5') {
            errorMessage = 'Số sao đánh giá phải từ 1 đến 5';
          } else if (data.message === 'Bạn đã đánh giá sản phẩm này rồi') {
            errorMessage = 'Bạn đã đánh giá sản phẩm này rồi';
          }
        } else if (response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
        } else if (response.status === 403) {
          errorMessage = 'Bạn cần đăng nhập để đánh giá sản phẩm';
        } else if (response.status >= 500) {
          errorMessage = 'Máy chủ đang gặp sự cố, vui lòng thử lại sau';
        }
        Alert.alert('Lỗi', errorMessage);
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      let errorMessage = 'Không thể kết nối đến máy chủ';
      
      if (error instanceof TypeError && error.message === 'Network request failed') {
        errorMessage = 'Vui lòng kiểm tra kết nối mạng của bạn';
      } else if (error instanceof SyntaxError || error.message === 'Server response is not JSON') {
        errorMessage = 'Máy chủ đang gặp sự cố, vui lòng thử lại sau';
      }
      
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đánh giá sản phẩm</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <Text style={styles.orderInfo}>Mã đơn: #{orderId}</Text>
            <Text style={styles.orderInfo}>Mã sản phẩm: {product.productId}</Text>

            <View style={styles.productInfo}>
              <Image 
                source={{ uri: Im_URL + product.firstImage }} 
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productVariant}>
                  {product.variants[0].size} - {product.variants[0].color}
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Đánh giá của bạn:</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                  >
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={32}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Nhập đánh giá của bạn..."
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />

            {!rating && (
              <Text style={styles.warningText}>Vui lòng chọn số sao đánh giá</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, !rating && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!rating || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Đang gửi...' : (rating ? 'Gửi đánh giá' : 'Vui lòng chọn số sao')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 20,
    color: '#666',
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  orderInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: 'row',
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  productVariant: {
    fontSize: 13,
    color: '#666',
  },
  ratingContainer: {
    marginVertical: 16,
  },
  ratingLabel: {
    fontSize: 15,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6600',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  warningText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 