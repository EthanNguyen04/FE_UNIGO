import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import CardviewProductSale from "../../components/home/CardviewProductSale";
import FixedHeader from "@/components/custom/FixedHeader";
import { BASE_URL, Get_product_sale_api, Get_productdx_api } from "../../api";

const screenWidth = Dimensions.get("window").width;

interface Product {
  id: string;
  link: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

// Component Skeleton cho sản phẩm sale (horizontal)
const ProductSaleSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [fadeAnim]);

  return (
    <View style={styles.saleSkeletonContainer}>
      {[1, 2, 3].map((item) => (
        <Animated.View
          key={item}
          style={[styles.saleSkeletonItem, { opacity: fadeAnim }]}
        >
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTextLong} />
            <View style={styles.skeletonTextShort} />
            <View style={styles.skeletonPrice} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

// Component Skeleton cho sản phẩm đề xuất (grid)
const ProductSuggestSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [fadeAnim]);

  return (
    <View style={styles.suggestSkeletonContainer}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Animated.View
          key={item}
          style={[styles.suggestSkeletonItem, { opacity: fadeAnim }]}
        >
          <View style={styles.skeletonImageSquare} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTextMedium} />
            <View style={styles.skeletonTextShort} />
            <View style={styles.skeletonPriceSmall} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

// Component Loading chính với icon và text đẹp
const EnhancedLoading = ({ type = "sale", message = "Đang tải..." }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation xoay
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Animation scale
    const scale = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    scale.start();

    return () => {
      spin.stop();
      scale.stop();
    };
  }, [spinValue, scaleValue]);

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.loadingIcon,
          {
            transform: [
              { rotate: spinInterpolate },
              { scale: scaleValue },
            ],
          },
        ]}
      >
        <View style={styles.loadingCircle}>
          <View style={styles.loadingInnerCircle} />
        </View>
      </Animated.View>
      <Text style={styles.loadingText}>{message}</Text>
      {type === "sale" ? <ProductSaleSkeleton /> : <ProductSuggestSkeleton />}
    </View>
  );
};

export default function HomeScreen() {
  const [productsSale, setProductsSale] = useState<Product[]>([]);
  const [productsSuggest, setProductsSuggest] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    // Nếu đây là pull-to-refresh thì chỉ setRefreshing, không touch isLoading
    if (!refreshing) setIsLoading(true);

    // Fetch sale
    try {
      const saleRes = await fetch(`${BASE_URL}${Get_product_sale_api}`);
      const saleData = await saleRes.json();
      if (saleRes.ok && saleData.products) {
        setProductsSale(saleData.products);
      } else {
        Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm giảm giá.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải sản phẩm giảm giá.");
    }

    // Fetch đề xuất
    try {
      const dxRes = await fetch(`${BASE_URL}${Get_productdx_api}`);
      const dxData = await dxRes.json();
      if (dxRes.ok && dxData.products) {
        setProductsSuggest(dxData.products);
      } else {
        Alert.alert("Lỗi", "Không nhận được dữ liệu sản phẩm đề xuất.");
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải sản phẩm đề xuất.");
    }

    setIsLoading(false);
    setRefreshing(false);
  }, [refreshing]);

  // Load lần đầu và khi focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  // Handler khi pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  return (
    <View style={styles.container}>
      <FixedHeader />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner */}
        <Image
          source={require("../../assets/images/banner.png")}
          contentFit="contain"
          style={styles.image_Banner}
        />

        {/* Sản phẩm giảm giá */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Image
              source={require("../../assets/images/sale_img.gif")}
              style={styles.image_gif}
              contentFit="contain"
            />
            <TouchableOpacity onPress={() => router.push("/flash_sale_screen")}>
              <Text style={styles.textSale}>Xem thêm {">"}</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <EnhancedLoading type="sale" message="Đang tải sản phẩm giảm giá..." />
          ) : (
            <FlatList
              horizontal
              data={productsSale}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/product_screen?idp=${encodeURIComponent(item.id)}`
                    )
                  }
                >
                  <CardviewProductSale
                    product={{
                      id: item.id,
                      image: { uri: item.link },
                      name: item.name,
                      original_price: item.discount_price,
                      discount_price: item.original_price,
                      discount: item.discount,
                    }}
                  />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Đề xuất */}
        <View style={styles.dxHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.textDexuat}>Đề xuất</Text>
            <MaterialIcons
              name="stars" 
              size={17}
              color="rgb(255, 0, 166)"
              style={{ marginLeft: 6 }}
            />
          </View>
          <TouchableOpacity onPress={() => router.push("/listProduct")}>
            <Text style={styles.textSale}>Xem thêm {">"}</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <EnhancedLoading type="suggest" message="Đang tải sản phẩm đề xuất..." />
        ) : (
          <FlatList
            data={productsSuggest.slice(0, 10)}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <CardviewProductSuggest
                product={{
                  id: item.id,
                  image: { uri: item.link },
                  name: item.name,
                  original_price: item.discount_price,
                  discount_price: item.original_price,
                  discount: item.discount,
                }}
                onPress={() =>
                  router.push(
                    `/product_screen?idp=${encodeURIComponent(item.id)}`
                  )
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingBottom: 40 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 5 },
  image_Banner: { width: "100%", alignSelf: "center", aspectRatio: 10 / 3 },
  image_gif: { width: "25%", aspectRatio: 6 / 3 },
  saleSection: { marginBottom: 10 },
  saleHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dxHeader: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 8,
  },
  textDexuat: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "bold",
    color: "rgb(255, 0, 166)",
  },
  textSale: {
    marginRight: 30,
    color: "rgba(4, 84, 126, 0.8)",
    padding: 10,
    fontSize: 10
  },
  columnWrapper: { justifyContent: "space-between", margin: 5},
  divider: {
    width: screenWidth * 0.95,
    height: 1,
    backgroundColor: "#cacaca",
    marginHorizontal: screenWidth * 0.01,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Enhanced Loading Styles
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingIcon: {
    marginBottom: 10,
  },
  loadingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FF8000",
    borderTopColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 128, 0, 0.3)",
  },
  loadingText: {
    fontSize: 14,
    color: "#FF8000",
    fontWeight: "500",
    marginBottom: 15,
  },
  
  // Skeleton styles for sale products
  saleSkeletonContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  saleSkeletonItem: {
    width: 140,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  skeletonImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#e0e0e0",
  },
  skeletonTextContainer: {
    padding: 8,
  },
  skeletonTextLong: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonTextShort: {
    height: 10,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonPrice: {
    height: 14,
    width: "50%",
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
  },

  // Skeleton styles for suggest products
  suggestSkeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  suggestSkeletonItem: {
    width: (screenWidth - 30) / 2,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  skeletonImageSquare: {
    width: "100%",
    height: 120,
    backgroundColor: "#e0e0e0",
  },
  skeletonTextMedium: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonPriceSmall: {
    height: 12,
    width: "60%",
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
  },
});