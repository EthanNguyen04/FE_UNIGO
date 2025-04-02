import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import FixedHeader from '@/components/custom/FixedHeader';
import { Image } from 'expo-image';  // Sử dụng expo-image cho contentFit
import ProductInfo from '@/components/product/infoProduct';
import ContentProduct from '@/components/product/contentProduct';
import ReviewProduct from '@/components/product/reviewProduct';
import ReviewList from '@/components/product/reviewList';
import ProductFooter from '@/components/product/footerProduct';

// Ví dụ, bạn muốn hiển thị 3 màu tùy chỉnh, 4 size tùy chỉnh
const customColors = ["Trắng", "chuyền", "Xanh Dương"];
const customSizes = ["S", "M", "L", "XL"];


const { width, height } = Dimensions.get('window');


  // Hàm callback: log ra dữ liệu
  const handleConfirmAction = (
    color: string,
    size: string,
    quantity: number,
    action: string
  ) => {
    console.log("Dữ liệu đã chọn:", {
      color,
      size,
      quantity,
      action,
    });
    // Bạn có thể thực hiện logic khác, ví dụ:
    // gọi API, thêm vào redux store, điều hướng sang trang khác...
  };

// Hàm callback: log khi bấm Yêu thích
const handleFavoritePress = (nextValue: boolean) => {
  console.log("User pressed favorite. yêu thích =", nextValue);
};


const images = [
  { id: '1', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnpl0qujldkdcc' },
  { id: '2', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lnpl0qujh5v1a2' },
  { id: '3', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm8b9hn0mfa776' },
  { id: '4', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsr4ki8zox3t83' },
  { id: '5', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsr4ki8znijded' },
  { id: '6', uri: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltp9ndszrdvxe3' },
];

const reviews = [
  {
    id: '1',
    name: 'Lionel Messi',
    avatar: 'https://img.freepik.com/premium-photo/software-engineer-digital-avatar-generative-ai_934475-8997.jpg?w=2000',
    rating: 4.6,
    comment: 'Sản phẩm quá đẹp luôn',
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo',
    avatar: 'https://img.freepik.com/premium-photo/ai-generated-avatar-futuristic-style_934475-8997.jpg',
    rating: 5.0,
    comment: 'Tuyệt vời, chất lượng tốt!',
  },
  {
    id: '3',
    name: 'Neymar Jr',
    avatar: 'https://img.freepik.com/premium-photo/ai-generated-avatar_934475-8997.jpg',
    rating: 4.2,
    comment: 'Đáng giá tiền, sẽ mua lại!',
  },
  {
    id: '4',
    name: 'Suares',
    avatar: 'https://img.freepik.com/premium-photo/ai-generated-avatar_934475-8997.jpg',
    rating: 4.8,
    comment: 'Đáng giá tiền, sẽ mua lại!',
  },
];

const ProductScreen: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [selectedSize, setSelectedSize] = useState('XXL - (70 - 80kg)');
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);


  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);

  // Lắng nghe sự kiện cuộn trên FlatList để cập nhật chỉ số ảnh
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index + 1);
      },
    }
  );
  const handleBack = () => {
      router.back();
  };

  return (
      <View style={styles.Product_Screen}>
        <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerFind}>
          <FixedHeader />
        </View>

        </View>
        {/* Nội dung cuộn */}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Slide ảnh sản phẩm */}
          <View style={styles.product_slide}>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.image_product}>
                  {/* Dùng expo-image với contentFit thay cho resizeMode */}
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                    contentFit="contain" // tương đương stretch
                  />
                </View>
              )}
              onScroll={handleScroll}
            />

            {/* Hiển thị số thứ tự ảnh */}
            <View style={styles.imageCounter}>
              <Text style={styles.counterText}>
                {currentIndex}/{images.length}
              </Text>
            </View>
          </View>

          {/* Thông tin sản phẩm */}
          <ProductInfo
            productName="Áo thun nữ cộc tay nhún eo vạt chéo xoắn Eo Cổ Tròn CaMa Store M1176"
            priceText={1000000}       // Tương đương 1 triệu
            priceDiscount={7000000}   // Tương đương 7 triệu
            evaluate={4.6}
            sold={1234000}            // Nếu "1234K" nghĩa là 1.234.000, bạn cần đổi sang số
            inStock={1234}            // 1.234 tồn kho
          />


          <ContentProduct
                  title="Mô tả sản phẩm"
                  description_text="Áo thun nữ cộc tay nhún eo vạt chéo, Xoắn Eo Cổ Tròn CaMa Store M1176.
                    Áo thun nữ năng động, xinh xắn luôn là sản phẩm yêu thích của các cô gái trẻ.
                    ... (VD cắt bớt để gọn code)
                  "
                />

          {/* Đánh giá sản phẩm */}
          <View style={styles.product_vote}>
            <ReviewProduct reviewCount={3000} //hàm chuyển màn onPressSeeMore={handleSeeMore} 
            />
            <ReviewList reviews={reviews} />
          </View>
        </ScrollView>

        {/* Footer: Yêu thích, Giỏ hàng, Mua ngay */}
        {/* Nội dung màn hình... */}
        <ProductFooter
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        quantity={quantity}
        setQuantity={setQuantity}
        colors={customColors}
        sizes={customSizes}
        onConfirmAction={handleConfirmAction}     // Log cart/buy
        onFavoritePress={handleFavoritePress}     // Log favorite
      />
      </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({

  Product_Screen: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  header:{
    width: width,
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 1)',
    alignItems: "center"
  },
  backButton: {
    padding: 5,
    marginTop: 10
  },
  headerFind:{
    width: width * 0.9,
    marginRight: 5
  },
  product_slide: {
  },
  image_product: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(207, 207, 207)',
  },
  image: {
    width: width * 0.95,
    height: width * 0.7,
    aspectRatio: 16 / 9,
    borderRadius: width * 0.02,
  },
  imageCounter: {
    position: 'absolute',
    bottom: height * 0.017,
    right: width * 0.035,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.011,
  },
  counterText: {
    color: '#fff',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  // Đánh giá
  product_vote: {
    marginLeft: width * 0.04,
  },
  // Footer
  
});
