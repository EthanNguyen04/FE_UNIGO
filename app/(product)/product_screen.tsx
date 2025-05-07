// src/screens/ProductScreen.tsx
import { BASE_URL, Get_product, Im_URL } from "../../api";
import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

  // Slider state
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    // Fetch product detail
    if (!idp) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}${Get_product}${idp}`);
        const data = await res.json();
        setProductData(data);
      } catch (e) {
        console.error("Lỗi khi gọi API:", e);
      }
    })();
  }, [idp]);

  if (!productData) {
    return (
      <View style={styles.loading}>
        <Text>Đang tải dữ liệu sản phẩm...</Text>
      </View>
    );
  }

  const {
    images,
    name,
    salePrice,
    discountPrice,
    quantity: inStock,
    description,
    variants: rawVariants,
    id: productId,
  } = productData;

  // Ép kiểu variants
  const variants = rawVariants as Variant[];

  // Tính danh sách màu & size
  const colors = Array.from(new Set(variants.map(v => v.color))) as string[];
  const sizes  = Array.from(new Set(variants.map(v => v.size)))  as string[];

  // Khi scroll slider
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

  const handleBack = () => router.back();

  // Khi bấm “Mua ngay” ở modal
  const handleConfirmAction = (
    color: string,
    size: string,
    qty: number,
    action: string,
    variant: Variant,
    pid: string
  ) => {
    // Tạo mảng selectedProducts gồm đúng 1 phần tử
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

  return (
    <View style={styles.screen}>
      {/* Header */}
      <FixedHeader />

      {/* Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Slider */}
        <View style={styles.slider}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrap}>
                <Image source={{ uri: Im_URL + item }} style={styles.image} contentFit="contain" />
              </View>
            )}
            onScroll={onScroll}
          />
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex}/{images.length}
            </Text>
          </View>
        </View>

        {/* Thông tin */}
        <ProductInfo
          productName={name}
          priceText={salePrice}
          priceDiscount={discountPrice}
          evaluate={4.6}
          sold={0}
          inStock={inStock}
        />

        <ContentProduct title="Mô tả sản phẩm" description_text={description} />

        <View style={styles.review}>
          <ReviewProduct reviewCount={0} />
        </View>
      </ScrollView>

      {/* Footer với nút Mua/Thêm giỏ */}
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
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  backBtn: {
    marginRight: 10,
  },
  slider: {},
  imageWrap: {
    width,
    height: width * 0.75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  image: {
    width: width * 0.95,
    height: width * 0.7,
    borderRadius: 8,
  },
  counter: {
    position: "absolute",
    bottom: 12,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counterText: {
    color: "#fff",
    fontSize: 12,
  },
  review: {
    marginLeft: 16,
  },
});
