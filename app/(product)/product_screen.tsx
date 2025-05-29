// src/screens/ProductScreen.tsx
import { BASE_URL, Get_product, Im_URL, Get_evaluate_product } from "../../api";
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import FixedHeader from "@/components/custom/FixedHeader";
import { Image } from "expo-image";
import ProductInfo from "@/components/product/infoProduct";
import ContentProduct from "@/components/product/contentProduct";
import ReviewProduct from "@/components/product/reviewProduct";
import ProductFooter, { Variant } from "@/components/product/footerProduct";

const { width, height } = Dimensions.get("window");

const ProductScreen: React.FC = () => {
  const { idp } = useLocalSearchParams<{ idp: string }>();
  const [productData, setProductData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const [showBackButton, setShowBackButton] = useState(true); // State để kiểm soát hiển thị back button
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);

  // Slider state
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);

  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const backButtonOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.1, 1, 0.9],
    extrapolate: 'clamp',
  });

  // Listener để theo dõi giá trị scroll và cập nhật state
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      setShowBackButton(value < 150); // Hiển thị back button khi scroll < 150
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);

  useEffect(() => {
    if (!idp) return;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}${Get_product}${idp}`);
        const data = await res.json();
        console.log("san pham:", JSON.stringify(data));
        setProductData(data);
      } catch (e) {
        console.error("Lỗi khi gọi API:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [idp]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <Animated.View
              style={[
                styles.loadingIcon,
                {
                  transform: [{
                    rotate: scrollY.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    })
                  }]
                }
              ]}
            >
              <Ionicons name="cube-outline" size={60} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
            <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!productData) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>Không thể tải sản phẩm</Text>
          <Text style={styles.errorSubtitle}>Vui lòng thử lại sau</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Destructure đúng tên field từ API
  const {
    images,
    name,
    stock,          // API trả về stock
    sold,
    description,
    variants: rawVariants,
    discount,       // phần trăm giảm giá
    id: productId,
    averageStar,
  } = productData;

  // Ép kiểu và lấy giá salePrice từ variant đầu tiên
  const variants = rawVariants as Variant[];
  const salePrice = variants[0]?.price ?? 0;
  // Tính giá gốc (originalPrice) từ salePrice và discount%
  const originalPrice =
    discount > 0
      ? Math.round(salePrice / (1 - discount / 100))
      : salePrice;

  // Danh sách màu & size
  const colors = Array.from(new Set(variants.map((v: Variant) => v.color)));
  const sizes = Array.from(new Set(variants.map((v: Variant) => v.size)));

  // Xử lý scroll slider
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(idx + 1);
      },
    }
  );

  // Khi bấm "Mua ngay"
  const handleConfirmAction = (
    color: string,
    size: string,
    qty: number,
    action: string,
    variant: Variant,
    pid: string
  ) => {
    const selectedProducts = [
      {
        product_id: pid,
        name,
        price: variant.price,
        size,
        color,
        quantity: qty,
      },
    ];
    router.push({
      pathname: "/order_screen",
      params: { selectedProducts: JSON.stringify(selectedProducts) },
    });
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <Animated.View
      style={[
        styles.imageWrap,
        {
          transform: [{ scale: imageScale }]
        }
      ]}
    >
      <Image
        source={{ uri: Im_URL + item }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      {/* Gradient overlay for better text contrast */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        style={styles.imageOverlay}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <FixedHeader />
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Enhanced Image Slider */}
        <View style={styles.sliderContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_: string, i: number) => i.toString()}
            renderItem={renderImageItem}
            onScroll={onScroll}
            decelerationRate="fast"
            snapToInterval={width}
            bounces={false}
          />

          {/* Modern Image Counter */}
          <View style={styles.counterContainer}>
            <LinearGradient
              // colors={['rgba(99, 102, 241, 0.9)', 'rgba(0, 13, 255, 0.9)']}
              colors={['rgba(255, 72, 0, 0.9)', 'rgba(139, 92, 246, 0.9)']}
              style={styles.counter}
            >
              <Ionicons name="images-outline" size={14} color="#FFFFFF" />
              <Text style={styles.counterText}>
                {currentIndex}/{images.length}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Content Container with Modern Design */}
        <View style={styles.contentContainer}>
          {/* Product Info Section */}
          <View style={styles.infoSection}>
            <ProductInfo
              productName={name}
              priceText={salePrice}
              priceDiscount={originalPrice}
              evaluate={averageStar || 0}
              sold={sold}
              inStock={stock}
              hidePrice={stock === 0}
            />

            {stock === 0 && (
              <View style={styles.outOfStockMessage}>
                <Text style={styles.outOfStockText}>
                  Sản phẩm này hiện đang ngừng bán, bạn hãy quay lại sau nhé !
                </Text>
              </View>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <ContentProduct
              title="Mô tả sản phẩm"
              description_text={description}
            />
          </View>

          {/* Review Section */}
          <View style={styles.reviewSection}>
            <ReviewProduct
              reviewCount={totalReviews}
              reviews={reviews}
            />
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </Animated.ScrollView>

      {/* Enhanced Footer */}
      <View style={styles.footerContainer}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', '#FFFFFF']}
          style={styles.footerGradient}
        >
          {stock > 0 && (
            <ProductFooter
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
              colors={colors}
              sizes={sizes}
              variants={variants}
              productId={productId}
              onConfirmAction={handleConfirmAction}
              onFavoritePress={setIsFavorite}
            />
          )}
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  loadingSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
  },

  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorContent: {
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  // Image Slider
  sliderContainer: {
    position: 'relative',
  },
  imageWrap: {
    width,
    height: width * 0.8,
    backgroundColor: "#F8FAFC",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '90%',
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
    resizeMode: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  // Counter
  counterContainer: {
    position: "absolute",
    bottom: 35,
    right: 20,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Pagination
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Favorite Button
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  favoriteGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Content Sections
  contentContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: -25,
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },

  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
  },

  descriptionSection: {
    backgroundColor: '#F8FAFC',
    // marginHorizontal: 16,
    // paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  reviewSection: {
    marginLeft: 5,
    backgroundColor: '#FFFFFF',
    // marginRight: 16,
    padding: 10,
    justifyContent: 'center',
    // borderRadius: 16,
    // marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  bottomSpacing: {
    height: 120, // Space for footer
  },

  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  footerGradient: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 26,
    left: 20,
    zIndex: 100, // cao để không bị che
  },
  backButton: {
    width: 44,         // Kích thước 44x44
    height: 44,
    borderRadius: 22,  // Bo tròn hoàn toàn
    overflow: 'hidden', // Ẩn phần thừa
    elevation: 4,      // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',  // Căn giữa icon
    alignItems: 'center',
  },
  outOfStockMessage: {
    backgroundColor: "#fff3cd",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeeba",
  },
  outOfStockText: {
    color: "#856404",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});