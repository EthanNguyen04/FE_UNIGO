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
        <FontAwesome name="shopping-basket" size={20} color="#ff9800" />
        <Text style={styles.text}>{"Thêm vào\nGiỏ hàng"}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.buyNow} onPress={() => openModal("buy")}>
        <Image source={icons.buy} style={styles.cartIcon} contentFit="contain" />
        <Text style={styles.buyText}>Mua ngay</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modal_product}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Size</Text>
              <View style={styles.option_product}>
                {sizes.map(size => {
                  const disabled = selectedColor
                    ? !variants.some(v => v.color === selectedColor && v.size === size)
                    : false;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionButton,
                        selectedSize === size && styles.selectedOption,
                        disabled && styles.disabledOption,
                      ]}
                      onPress={onSizePress(size)}
                      disabled={disabled}
                    >
                      <Text style={styles.optionText}>{size}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.modalTitle}>Màu sắc</Text>
              <View style={styles.option_product}>
                {colors.map(color => {
                  const disabled = selectedSize
                    ? !variants.some(v => v.size === selectedSize && v.color === color)
                    : false;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.optionButton,
                        selectedColor === color && styles.selectedOption,
                        disabled && styles.disabledOption,
                      ]}
                      onPress={onColorPress(color)}
                      disabled={disabled}
                    >
                      <Text style={styles.optionText}>{color}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.infoContainer}>
                {selectedVariant ? (
                  <>
                    <Text style={[styles.infoText, styles.priceText]}>
                      {formatPrice(selectedVariant.price)}
                    </Text>
                    <Text style={styles.infoText}>
                      Kho: {selectedVariant.quantity}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.infoText}>
                    Vui lòng chọn đầy đủ size và màu
                  </Text>
                )}
              </View>

              {selectedVariant && (
                <View style={styles.cart_icon}>
                  <Text style={styles.modalTitle_product}>Số lượng</Text>
                  <View style={styles.quantity_product}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={decrementQuantity}
                    >
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityNumber}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={incrementQuantity}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {userType === "khach" ? (
              <TouchableOpacity
                style={styles.loginbtn}
                onPress={() => alert("Vui lòng đăng nhập để mua hàng")}
              >
                <Text style={styles.buyText}>Đăng nhập để mua</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buyNow_modal}
                onPress={handleConfirm}
              >
                <Image
                  source={
                    selectedAction === "cart" ? icons.addcart : icons.buy
                  }
                  style={styles.cartIcon}
                  contentFit="contain"
                />
                <Text style={styles.buyText}>
                  {selectedAction === "cart" ? "Thêm vào giỏ" : "Mua ngay"}
                </Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: "#ff9800",
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
  buyNow_modal: {
    width: width * 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff9800",
    borderRadius: 10,
    alignSelf: "flex-end",
    justifyContent: "flex-start",
  },
  loginbtn: {
    width: width * 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#AEAEAE",
    borderRadius: 10,
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingVertical: 10,
  },
  modal_product: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.99,
    height: height * 0.58,
    backgroundColor: "#fff",
    padding: width * 0.04,
    borderRadius: width * 0.02,
  },
  modalBody: { flex: 1 },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: width * 0.09,
    height: width * 0.09,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: { fontSize: 15, color: "#AEAEAE" },
  modalTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.015,
  },
  modalTitle_product: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    width: width * 0.4,
  },
  option_product: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: height * 0.02,
  },
  optionButton: {
    padding: width * 0.02,
    backgroundColor: "#ddd",
    borderRadius: width * 0.01,
    marginRight: width * 0.02,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#ff9800",
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: width * 0.026,
  },
  infoContainer: {
    marginVertical: height * 0.015,
  },
  infoText: {
    fontSize: width * 0.04,
  },
  priceText: {
    color: "#ff9800",
    fontSize: 15,
  },
  cart_icon: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity_product: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: width * 0.25,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: width * 0.025,
    borderRadius: width * 0.011,
    marginHorizontal: width * 0.025,
  },
  quantityText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  quantityNumber: {
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  text: {
    marginLeft: width * 0.02,
    fontSize: width * 0.025,
    color: "#000",
    textAlign: "center",
  },
});
