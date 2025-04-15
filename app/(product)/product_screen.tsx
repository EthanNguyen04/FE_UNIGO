import { BASE_URL, Get_product, Im_URL, Get_all_cate } from "../../api";
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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import FixedHeader from "@/components/custom/FixedHeader";
import { Image } from "expo-image";
import ProductInfo from "@/components/product/infoProduct";
import ContentProduct from "@/components/product/contentProduct";
import ReviewProduct from "@/components/product/reviewProduct";
import ProductFooter, { Variant } from "@/components/product/footerProduct";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

const { width, height } = Dimensions.get("window");

const ProductScreen: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState<any>(null);
  const { idp } = useLocalSearchParams();

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      if (!idp) return;
      try {
        const response = await fetch(`${BASE_URL}${Get_product}${idp}`);
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchProductData();
  }, [idp]);

  if (!productData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải dữ liệu sản phẩm...</Text>
      </View>
    );
  }

  const { images, name, salePrice, discountPrice, quantity: inStock, description, variants, id } = productData;

  // Sửa lỗi: ép kiểu để colors và sizes là string[]
  const colors = variants
    ? Array.from(new Set(variants.map((v: any) => v.color))) as string[]
    : [];
  const sizes = variants
    ? Array.from(new Set(variants.map((v: any) => v.size))) as string[]
    : [];

  const selectedVariant = variants
    ? variants.find((v: any) => v.color === selectedColor && v.size === selectedSize)
    : null;

  const currentPrice = selectedVariant ? selectedVariant.price : salePrice;
  const currentStock = selectedVariant ? selectedVariant.quantity : inStock;

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

  const handleConfirmAction = (
    color: string,
    size: string,
    quantitySelected: number,
    action: string,
    variant: Variant,
    productId: string
  ) => {
    // Bỏ Alert, thay vào đó bạn có thể thực hiện xử lý khác (ví dụ: logging hoặc cập nhật state)
    console.log("Variant selected:", { color, size, quantitySelected, variant, productId, action });
    // Khi modal đóng, ProductFooter đã hiển thị thông tin của variant được chọn (price & quantity)
  };
  

  const handleFavoritePress = (nextValue: boolean) => {
    setIsFavorite(nextValue);
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

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.product_slide}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.image_product}>
                <Image
                  source={{ uri: Im_URL + item }}
                  style={styles.image}
                  contentFit="contain"
                />
              </View>
            )}
            onScroll={handleScroll}
          />
          <View style={styles.imageCounter}>
            <Text style={styles.counterText}>
              {currentIndex}/{images.length}
            </Text>
          </View>
        </View>

        <ProductInfo
          productName={name}
          priceText={salePrice}
          priceDiscount={discountPrice}
          evaluate={4.6}
          sold={0}
          inStock={inStock}
        />

        <ContentProduct title="Mô tả sản phẩm" description_text={description} />

        <View style={styles.product_vote}>
          <ReviewProduct reviewCount={0} />
        </View>
      </ScrollView>

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
        // Sử dụng variant giá trị được tính toán từ ProductScreen (ví dụ currentPrice, id, variants, ...)
        productId={id}
        variants={variants}
        onConfirmAction={handleConfirmAction}
        onFavoritePress={handleFavoritePress}
      />

    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  Product_Screen: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  header: {
    width: width,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
    marginTop: 10,
  },
  headerFind: {
    width: width * 0.9,
    marginRight: 5,
  },
  product_slide: {},
  image_product: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(207, 207, 207)",
  },
  image: {
    width: width * 0.95,
    height: width * 0.7,
    aspectRatio: 16 / 9,
    borderRadius: width * 0.02,
  },
  imageCounter: {
    position: "absolute",
    bottom: height * 0.017,
    right: width * 0.035,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.011,
  },
  counterText: {
    color: "#fff",
    fontSize: width * 0.025,
    fontWeight: "bold",
  },
  product_vote: {
    marginLeft: width * 0.04,
  },
});
