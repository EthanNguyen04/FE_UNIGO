// src/components/product/footerProduct.tsx
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  Dimensions,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, Post_AddCart } from "../../api";
import FavoriteButton from "./likeBtn";

const icons = {
  buy: require("../../assets/images/buynow_img.png"),
  addcart: require("../../assets/images/addtocart.png"),
};

const { width, height } = Dimensions.get("window");

export interface Variant {
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface ProductFooterProps {
  setIsFavorite: Dispatch<SetStateAction<boolean>>;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  selectedAction: string | null;
  setSelectedAction: Dispatch<SetStateAction<string | null>>;
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
  selectedSize: string;
  setSelectedSize: Dispatch<SetStateAction<string>>;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  colors?: string[];
  sizes?: string[];
  variants: Variant[];
  productId: string;
  onConfirmAction?: (
    color: string,
    size: string,
    quantity: number,
    action: string,
    variant: Variant,
    productId: string
  ) => void;
  onFavoritePress?: (nextValue: boolean) => void;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

const ProductFooter: React.FC<ProductFooterProps> = ({
  setIsFavorite,
  modalVisible,
  setModalVisible,
  selectedAction,
  setSelectedAction,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  colors = [],
  sizes = [],
  variants,
  productId,
  onConfirmAction,
  onFavoritePress,
}) => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("type").then(setUserType);
  }, []);

  const availableColors = selectedSize
    ? Array.from(new Set(variants.filter(v => v.size === selectedSize).map(v => v.color)))
    : colors;
  const availableSizes = selectedColor
    ? Array.from(new Set(variants.filter(v => v.color === selectedColor).map(v => v.size)))
    : sizes;

  const selectedVariant =
    selectedSize && selectedColor
      ? variants.find(v => v.size === selectedSize && v.color === selectedColor) || null
      : null;

  const openModal = (action: string) => {
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
    setSelectedAction(action);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));
  const incrementQuantity = () =>
    selectedVariant && setQuantity(q => Math.min(q + 1, selectedVariant.quantity));

  const handleConfirm = async () => {
    if (!selectedSize || !selectedColor || !selectedVariant) {
      return ToastAndroid.show("Vui lòng chọn đầy đủ size và màu", ToastAndroid.SHORT);
    }
    const token = await AsyncStorage.getItem("token");
    if (!token) return ToastAndroid.show("Vui lòng đăng nhập", ToastAndroid.SHORT);

    if (selectedAction === "cart") {
      try {
        const res = await fetch(BASE_URL + Post_AddCart, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
            size: selectedSize,
            color: selectedColor,
            quantity,
          }),
        });
        const data = await res.json();
        ToastAndroid.show(
          res.ok ? "Đã thêm sản phẩm vào giỏ hàng" : `Lỗi: ${data.message}`,
          ToastAndroid.SHORT
        );
      } catch (e) {
        console.error(e);
      }
    } else if (selectedAction === "buy" && onConfirmAction) {
      onConfirmAction(
        selectedColor,
        selectedSize,
        quantity,
        selectedAction,
        selectedVariant,
        productId
      );
    }
    closeModal();
  };

  // chọn/bỏ chọn size
  const onSizePress = (size: string) => (e: GestureResponderEvent) => {
    if (size === selectedSize) {
      setSelectedSize("");
      return;
    }
    if (selectedColor && !variants.some(v => v.color === selectedColor && v.size === size)) {
      return;
    }
    setSelectedSize(size);
  };

  // chọn/bỏ chọn color
  const onColorPress = (color: string) => (e: GestureResponderEvent) => {
    if (color === selectedColor) {
      setSelectedColor("");
      return;
    }
    if (selectedSize && !variants.some(v => v.size === selectedSize && v.color === color)) {
      return;
    }
    setSelectedColor(color);
  };

  return (
    <View style={styles.footer}>
      <FavoriteButton productId={productId} />

      <View style={styles.divider} />

      <TouchableOpacity style={styles.cart} onPress={() => openModal("cart")}>
        <FontAwesome name="shopping-basket" size={20} color="#008080" />
        <Text style={styles.text}>{"Thêm vào Giỏ hàng"}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.buyNow} onPress={() => openModal("buy")}>
        <Image source={icons.buy} style={styles.cartIcon} contentFit="contain" />
        <Text style={styles.buyText}>Mua ngay</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close button */}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
              <AntDesign name="closecircle" size={24} color="#888" />
            </TouchableOpacity>

            <View style={styles.modalSection}>
              {/* Size selection */}
              <Text style={styles.modalLabel}>Chọn Size</Text>
              <View style={styles.modalOptions}>
                {sizes.map(size => {
                  const disabled = selectedColor
                    ? !variants.some(v => v.color === selectedColor && v.size === size)
                    : false;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionBtn,
                        selectedSize === size && styles.optionSelected,
                        disabled && styles.optionDisabled,
                      ]}
                      onPress={onSizePress(size)}
                      disabled={disabled}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedSize === size && styles.optionTextSelected,
                          disabled && styles.optionTextDisabled,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Color selection */}
              <Text style={styles.modalLabel}>Chọn Màu</Text>
              <View style={styles.modalOptions}>
                {colors.map(color => {
                  const disabled = selectedSize
                    ? !variants.some(v => v.size === selectedSize && v.color === color)
                    : false;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.optionBtn,
                        selectedColor === color && styles.optionSelected,
                        disabled && styles.optionDisabled,
                      ]}
                      onPress={onColorPress(color)}
                      disabled={disabled}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedColor === color && styles.optionTextSelected,
                          disabled && styles.optionTextDisabled,
                        ]}
                      >
                        {color}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Variant info */}
              <View style={styles.modalInfoRow}>
                {selectedVariant ? (
                  <>
                    <Text style={styles.priceText}>
                      {formatPrice(selectedVariant.price)}
                    </Text>
                    <Text style={styles.stockText}>Kho: {selectedVariant.quantity}</Text>
                  </>
                ) : (
                  <Text style={styles.stockText}>Vui lòng chọn đầy đủ size và màu</Text>
                )}
              </View>

              {/* Quantity */}
              {selectedVariant && (
                <View style={styles.quantityRow}>
                  <Text style={styles.modalLabel}>Số lượng</Text>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={decrementQuantity} style={styles.quantityBtn}>
                      <Text style={styles.quantitySymbol}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity onPress={incrementQuantity} style={styles.quantityBtn}>
                      <Text style={styles.quantitySymbol}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Confirm button */}
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                userType === "khach" && { backgroundColor: "#aaa" },
              ]}
              onPress={
                userType === "khach"
                  ? () => alert("Vui lòng đăng nhập để mua hàng")
                  : handleConfirm
              }
            >
              <Image
                source={selectedAction === "cart" ? icons.addcart : icons.buy}
                style={styles.cartIcon}
                contentFit="contain"
              />
              <Text style={styles.confirmText}>
                {selectedAction === "cart" ? "Thêm vào giỏ" : "Mua ngay"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductFooter;

const styles = StyleSheet.create({
  footer: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    height: height * 0.09,
  },
  divider: {
    width: 1,
    height: width * 0.1,
    backgroundColor: "rgb(68, 68, 68)",
  },
  cart: {
    alignItems: "center",
  },
  buyNow: {
    width: width * 0.45,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 94, 0, 0.84)",
    margin: width * 0.025,
    borderRadius: 10,
  },
  cartIcon: {
    margin: width * 0.02,
    marginLeft: 10,
    width: width * 0.13,
    height: width * 0.1,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  buyText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalSection: {
    marginTop: 30,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  optionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: "rgba(185, 185, 185, 0.77)",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#007bff",
  },
  optionDisabled: {
    backgroundColor: "#ddd",
  },
  optionText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.84)",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionTextDisabled: {
    color: "#999",
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "rgba(255, 50, 50, 0.84)",
  },
  stockText: {
    fontSize: 14,
    color: "#666",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityBtn: {
    backgroundColor: "rgba(92, 92, 92, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
  },
  quantitySymbol: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  quantityValue: {
    marginHorizontal: 15,
    fontSize: 15,
    fontWeight: "bold",
  },
  confirmBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 94, 0, 0.84)",
    // paddingVertical: 10,
    width: width * 0.46,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: width * 0.46
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 10,
    textAlign: "center",
    color: "#444",
    marginTop: 2,
  },
});