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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import FixedHeader from "@/components/custom/FixedHeader";
import { Image } from "expo-image";
import ProductInfo from "@/components/product/infoProduct";
import ContentProduct from "@/components/product/contentProduct";
import ReviewProduct from "@/components/product/reviewProduct";
import ProductFooter, { Variant } from "@/components/product/footerProduct";

const { width } = Dimensions.get("window");

const ProductScreen: React.FC = () => {
  const { idp } = useLocalSearchParams<{ idp: string }>();
  const [productData, setProductData] = useState<any>(null);
const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  // Slider state
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (!idp) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}${Get_product}${idp}`);
        const data = await res.json();
        console.log("san pham:", JSON.stringify(data));
        setProductData(data);

        // Fetch evaluations
        const evalRes = await fetch(`${BASE_URL}${Get_evaluate_product}${idp}`);
        const evalData = await evalRes.json();
        console.log("evaluations:", JSON.stringify(evalData));
        if (evalData.success) {
          setReviews(evalData.data.evaluates || []);
          setTotalReviews(evalData.data.total || 0);
        }
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
    averageStar,    // số sao trung bình
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
  const colors = Array.from(new Set(variants.map(v => v.color)));
  const sizes = Array.from(new Set(variants.map(v => v.size)));

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

  return (
    <View style={styles.screen}>
      <FixedHeader />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Slider */}
        <View>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: Im_URL + item }}
                  style={styles.image}
                  contentFit="contain"
                />
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

        {/* Thông tin sản phẩm */}
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

        {/* Mô tả */}
        <ContentProduct
          title="Mô tả sản phẩm"
          description_text={description}
        />

        {/* Review */}
        <View style={styles.review}>
          <ReviewProduct 
            reviewCount={totalReviews} 
            reviews={reviews}
          />
        </View>
      </ScrollView>

      {/* Footer mua / thêm giỏ */}
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
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  counterText: { color: "#fff", fontSize: 12 },
  review: { marginLeft: 16 },
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
