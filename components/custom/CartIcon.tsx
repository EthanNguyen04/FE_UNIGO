import { Image } from 'expo-image';  // Import expo-image
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter từ expo-router

const icons = {
  cart: require('../../assets/images/cart_img.png'), // Đảm bảo đường dẫn đúng tới biểu tượng giỏ hàng của bạn
};
const cartCount = 1;  // Số lượng sản phẩm trong giỏ hàng

const CartIcon = () => {
  const router = useRouter();  // Khởi tạo useRouter để điều hướng

  // Hàm điều hướng khi nhấn vào giỏ hàng
  const handlePress = () => {
    router.push('/cart_screen');  // Điều hướng đến màn hình giỏ hàng
  };

  return (
    <TouchableOpacity style={styles.cartIconContainer} onPress={handlePress}>
      <View style={styles.iconBackground}>
        <Image source={icons.cart} style={styles.ic_cart} contentFit="contain" />
      </View>

      {/* Hiển thị badge nếu có sản phẩm trong giỏ hàng */}
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#EEEDED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ic_cart: {
    width: 30,
    height: 30,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartIcon;
