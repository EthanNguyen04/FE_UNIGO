import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import ItemProductSale from '../../../components/flash_sale/itemProductSale';
import { BASE_URL, Get_all_product_sale, Im_URL } from '../../../api';
import { router } from 'expo-router';
import { MaterialIcons } from "@expo/vector-icons";

// Constants
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const LOGO_WIDTH_RATIO = 0.18;
const LOGO_HEIGHT_RATIO = 0.1;

// Types
interface ProductSale {
  id: string;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  image: { uri: string };
}

interface ApiProductResponse {
  id: string;
  name: string;
  discount_price: number;
  original_price: number;
  discount: number;
  link: string;
}

interface ApiResponse {
  products: ApiProductResponse[];
}

const FlashSaleScreen: React.FC = () => {
  // State
  const [productsSale, setProductsSale] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // Back handler
  const handleBack = () => {
    console.log('Back pressed');
    router.back();
  };

  // Transform API data to component format
  const transformProductData = useCallback((apiProducts: ApiProductResponse[]): ProductSale[] => {
    return apiProducts.map((item) => ({
      id: item.id,
      name: item.name,
      oldPrice: item.discount_price,
      newPrice: item.original_price,
      discount: `${item.discount}%`,
      image: { uri: `${Im_URL}${item.link}` },
    }));
  }, []);

  // Animate content on load
  const animateContent = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Fetch sale products from API
  const fetchSaleProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}${Get_all_product_sale}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid API response format');
      }

      const transformedData = transformProductData(data.products);
      setProductsSale(transformedData);
      animateContent();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error fetching sale products:', errorMessage);
      setError(errorMessage);

      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách sản phẩm khuyến mãi. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }, [transformProductData, animateContent]);

  // Render product item
  const renderProductItem = useCallback(
    ({ item, index }: { item: ProductSale; index: number }) => (
      <View style={[
        styles.productItemWrapper,
        index % 2 === 0 ? styles.productLeft : styles.productRight
      ]}>
        <ItemProductSale product={item} />
      </View>
    ),
    []
  );

  // Get item key
  const keyExtractor = useCallback((item: ProductSale) => item.id, []);

  // Effects
  useEffect(() => {
    fetchSaleProducts();
  }, [fetchSaleProducts]);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.screenContainer}>
        {/* Fixed Back Button */}
        {/* <View style={styles.fixedBackContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View> */}

        <LinearGradient
          colors={['#FF4757', '#FF6B8A', '#C44569', '#F8B500']}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.loadingContainer}
        >
          <BlurView intensity={20} style={styles.loadingBlur}>
            <View style={styles.loadingContent}>
              <View style={styles.loadingSpinnerContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.loadingSpinner}
                >
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.loadingRings}>
                  <View style={[styles.ring, styles.ring1]} />
                  <View style={[styles.ring, styles.ring2]} />
                  <View style={[styles.ring, styles.ring3]} />
                </View>
              </View>

              <Text style={styles.loadingTitle}>✨ Flash Sale đang tải</Text>
              <Text style={styles.loadingSubtitle}>Chuẩn bị những ưu đài tuyệt vời...</Text>

              <View style={styles.loadingDots}>
                <Animated.View style={[styles.dot, styles.dotPulse]} />
                <Animated.View style={[styles.dot, styles.dotPulse2]} />
                <Animated.View style={[styles.dot, styles.dotPulse3]} />
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.screenContainer}>
        {/* Fixed Back Button */}
        {/* <View style={styles.fixedBackContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View> */}

        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.errorBackground}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.errorContainer}>
              <Animated.View style={[styles.errorCard, {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
              }]}>
                <LinearGradient
                  colors={['#ffffff', '#f8f9ff']}
                  style={styles.errorCardGradient}
                >
                  <View style={styles.errorIconContainer}>
                    <LinearGradient
                      colors={['#ff9a9e', '#fecfef']}
                      style={styles.errorIconGradient}
                    >
                      <Text style={styles.errorIcon}>💔</Text>
                    </LinearGradient>
                  </View>

                  <Text style={styles.errorTitle}>Oops! Có gì đó không ổn</Text>
                  <Text style={styles.errorMessage}>
                    Flash Sale tạm thời không thể tải được.{'\n'}
                    Đừng lo, chúng tôi sẽ sửa ngay!
                  </Text>

                  <TouchableOpacity onPress={fetchSaleProducts}>
                    <LinearGradient
                      colors={['#FF4757', '#FF6B8A']}
                      style={styles.retryButton}
                    >
                      <Text style={styles.retryText}>
                        🚀 Thử lại ngay
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.decorativeElements}>
                    <View style={[styles.decorativeCircle, styles.circle1]} />
                    <View style={[styles.decorativeCircle, styles.circle2]} />
                    <View style={[styles.decorativeCircle, styles.circle3]} />
                  </View>
                </LinearGradient>
              </Animated.View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  // Main render - Scrollable version
  return (
    <View style={styles.screenContainer}>
      {/* Fixed Back Button */}
      {/* <View style={styles.fixedBackContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="rgb(72, 61, 139)" />
          <Text style={styles.backText}>Thông báo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Mega Premium Header */}
        <LinearGradient
          colors={['#FF4757', '#FF6B8A', '#C44569']}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.megaHeader}
        >
          <View style={styles.headerPattern}>
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />
            <View style={styles.patternCircle3} />
          </View>

          <BlurView intensity={15} style={styles.headerBlur}>
            <Animated.View style={[styles.headerContent, {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}>
              <View style={styles.headerLeft}>
                <View style={styles.titleContainer}>
                  <Text style={styles.headerTitle}>🔥 FLASH SALE</Text>
                  <View style={styles.titleUnderline} />
                </View>
                <Text style={styles.headerSubtitle}>Ưu đãi thần tốc - Giá sốc hôm nay</Text>

                <View style={styles.timerContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                    style={styles.timerBadge}
                  >
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.logoSection}>
                <LinearGradient
                  colors={['rgb(255, 255, 255)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.logoContainer}
                >
                  <Image
                    source={require('@/assets/images/unigo.png')}
                    style={styles.logo}
                    contentFit="contain"
                  />
                  <View style={styles.logoGlow} />
                </LinearGradient>
              </View>
            </Animated.View>
          </BlurView>
        </LinearGradient>

        {/* Ultra Premium Stats Card */}

        {/* Products Grid Section */}
        {productsSale.length > 0 ? (
          <Animated.View style={[styles.productsSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <View style={styles.productsGrid}>
              {productsSale.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.productItemWrapper,
                    index % 2 === 0 ? styles.productLeft : styles.productRight
                  ]}
                >
                  <ItemProductSale product={item} />
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.emptySection, {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.emptyBackground}
            >
              <View style={styles.emptyCard}>
                <LinearGradient
                  colors={['#ffffff', '#f8f9ff']}
                  style={styles.emptyCardGradient}
                >
                  <View style={styles.emptyIconContainer}>
                    <LinearGradient
                      colors={['#ffeaa7', '#fdcb6e']}
                      style={styles.emptyIconGradient}
                    >
                      <Text style={styles.emptyIcon}>🎁</Text>
                    </LinearGradient>
                  </View>

                  <Text style={styles.emptyTitle}>Flash Sale sắp có!</Text>
                  <Text style={styles.emptyText}>
                    Những ưu đãi tuyệt vời đang được chuẩn bị.{'\n'}
                    Hãy quay lại sau để không bỏ lỡ nhé! ✨
                  </Text>

                  <View style={styles.emptyDecorative}>
                    <View style={[styles.decorativeCircle, styles.emptyCircle1]} />
                    <View style={[styles.decorativeCircle, styles.emptyCircle2]} />
                  </View>
                </LinearGradient>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Scrollable Container
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Fixed Back Button Styles
  fixedBackContainer: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 1000,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Loading Styles - Ultra Premium
  loadingContainer: {
    flex: 1,
  },
  loadingBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 50,
  },
  loadingSpinnerContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  loadingSpinner: {
    borderRadius: 60,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loadingRings: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
  },
  ring: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
  },
  ring1: {
    width: 100,
    height: 100,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ring2: {
    width: 120,
    height: 120,
    top: -10,
    left: -10,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ring3: {
    width: 140,
    height: 140,
    top: -20,
    left: -20,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
  },
  dotPulse: {
    opacity: 1,
  },
  dotPulse2: {
    opacity: 0.7,
  },
  dotPulse3: {
    opacity: 0.4,
  },

  // Mega Header Styles
  megaHeader: {
    height: 180,
    marginBottom: 20,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  patternCircle2: {
    position: 'absolute',
    top: 20,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  patternCircle3: {
    position: 'absolute',
    bottom: -20,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerBlur: {
    flex: 1,
    padding: 24,
    paddingTop: 40, // Add space for fixed back button
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  titleUnderline: {
    height: 3,
    width: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timerContainer: {
    alignSelf: 'flex-start',
  },
  timerBadge: {
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  logoSection: {
    marginLeft: 20,
    marginBottom: 70
  },
  logoContainer: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  logo: {
    width: SCREEN_WIDTH * LOGO_WIDTH_RATIO,
    height: SCREEN_WIDTH * LOGO_HEIGHT_RATIO,
  },
  logoGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
  },

  // Ultra Premium Stats
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.1)',
  },
  statsGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: 'rgba(255,71,87,0.1)',
    zIndex: -1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statNumberBg: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },
  statIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 30,
    height: 3,
    backgroundColor: '#FF4757',
    borderRadius: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  dividerGradient: {
    flex: 1,
    width: 1,
  },

  // Products Section
  productsSection: {
    paddingHorizontal: 5,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItemWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  productLeft: {
    marginRight: '2%',
  },
  productRight: {
    marginLeft: '2%',
  },

  // Error Styles - Ultra Premium
  errorBackground: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: SCREEN_HEIGHT - 100,
  },
  errorCard: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  errorCardGradient: {
    padding: 40,
    alignItems: 'center',
    position: 'relative',
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorIconGradient: {
    borderRadius: 40,
    padding: 20,
    shadowColor: '#ff9a9e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  errorIcon: {
    fontSize: 50,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontWeight: '500',
  },
  retryButton: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 15,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  retryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
  },
  circle1: {
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,107,138,0.1)',
  },
  circle2: {
    bottom: 30,
    left: 30,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(102,126,234,0.1)',
  },
  circle3: {
    top: '50%',
    right: 10,
    width: 25,
    height: 25,
    backgroundColor: 'rgba(248,181,0,0.1)',
  },

  // Empty State Styles - Ultra Premium
  emptySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  emptyBackground: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyCard: {
    margin: 2, // Space for glow effect
  },
  emptyCardGradient: {
    padding: 50,
    alignItems: 'center',
    position: 'relative',
    borderRadius: 23,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    borderRadius: 35,
    padding: 18,
    shadowColor: '#ffeaa7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  emptyIcon: {
    fontSize: 45,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    maxWidth: 280,
  },
  emptyDecorative: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  emptyCircle1: {
    top: 30,
    right: 25,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,234,167,0.15)',
  },
  emptyCircle2: {
    bottom: 40,
    left: 20,
    width: 35,
    height: 35,
    backgroundColor: 'rgba(253,203,110,0.15)',
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  backText: {
    fontSize: 16,
    color: "rgb(72, 61, 139)",
    marginLeft: 6,
  },
});

export default FlashSaleScreen;