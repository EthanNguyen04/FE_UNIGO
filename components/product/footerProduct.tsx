import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  ToastAndroid,
  Dimensions,
  StyleSheet,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";

const icons = {
  buy: require("../../assets/images/buynow_img.png"),
  addcart: require("../../assets/images/addtocart.png"),

};

const { width, height } = Dimensions.get("window");

interface ProductFooterProps {
  // Các state & setState
  isFavorite: boolean;
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

  // Mảng color / size cha truyền vào (nếu có)
  colors?: string[];
  sizes?: string[];

  // Hàm cha nhận dữ liệu khi user xác nhận
  onConfirmAction?: (
    color: string,
    size: string,
    quantity: number,
    action: string
  ) => void;

  // Hàm cha nhận event khi user nhấn Yêu thích
  onFavoritePress?: (nextValue: boolean) => void;
}

const ProductFooter: React.FC<ProductFooterProps> = ({
  isFavorite,
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

  onConfirmAction,
  onFavoritePress,
}) => {
  const mustChooseColor = colors.length > 0; 
  const mustChooseSize = sizes.length > 0;

  // Bấm Yêu thích
  const handleFavoritePress = () => {
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);

    // Gọi callback cha để log
    if (onFavoritePress) {
      onFavoritePress(nextValue);
    }

    // Thông báo
    if (!isFavorite) {
      const message = "Đã thêm vào danh sách yêu thích!";
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert("Thông báo", message);
      }
    }
  };

  // Bấm “Thêm vào Giỏ hàng” / “Mua ngay”
  const handleActionPress = (action: string) => {
    // Reset color / size / quantity
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);

    // Ghi lại action & mở Modal
    setSelectedAction(action);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Khi user xác nhận trong modal
  const handleConfirm = () => {
    // Nếu cha có truyền colors => user phải chọn
    if (mustChooseColor && !selectedColor) {
      Alert.alert("Thông báo", "Bạn chưa chọn màu!");
      return;
    }
    // Nếu cha có truyền sizes => user phải chọn
    if (mustChooseSize && !selectedSize) {
      Alert.alert("Thông báo", "Bạn chưa chọn size!");
      return;
    }

    // Gọi callback cha
    if (onConfirmAction && selectedAction) {
      onConfirmAction(selectedColor, selectedSize, quantity, selectedAction);
    }
    closeModal();
  };

  return (
    <View style={styles.footer}>
      {/* Nút Yêu thích */}
      <TouchableOpacity style={styles.favorite} onPress={handleFavoritePress}>
        <AntDesign name="heart" size={20} color={isFavorite ? "red" : "gray"} />
        <Text style={styles.text}>
          {isFavorite ? "Yêu thích" : "Thêm vào Yêu thích"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Nút Giỏ hàng */}
      <TouchableOpacity style={styles.cart} onPress={() => handleActionPress("cart")}>
        <FontAwesome name="shopping-basket" size={20} color="#ff9800" />
        <Text style={styles.text}>Thêm vào Giỏ hàng</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Nút Mua ngay */}
      <TouchableOpacity style={styles.buyNow} onPress={() => handleActionPress("buy")}>
        <Image source={icons.buy} style={styles.cartIcon} contentFit="contain" />
        <Text style={styles.buyText}>Mua ngay</Text>
      </TouchableOpacity>

      {/* Modal Chọn color/size/số lượng */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modal_product}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Màu sắc</Text>
              <View style={styles.option_product}>
                {colors.map((color, index) => (
                  <View
                    key={color}
                    style={[
                      styles.optionWrapperColor,
                      index % 5 === 5 ? { marginRight: 0 } : {},
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        selectedColor === color && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      <Text style={styles.optionText}>{color}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.modalTitle}>Size</Text>
              <View style={styles.option_product}>
                {sizes.map((size, index) => (
                  <View
                    key={size}
                    style={[
                      styles.optionWrapperSize,
                      index % 3 === 2 ? { marginRight: 0 } : {},
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        selectedSize === size && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text style={styles.optionText}>{size}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.cart_text} />

              <View style={styles.cart_icon}>
                <Text style={styles.modalTitle_product}>Số lượng</Text>
                <View style={styles.quantity_product}>
                  <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityNumber}>{quantity}</Text>

                  <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cart_text} />
            </View>

            {/* Xác nhận */}
            {selectedAction === "cart" && (
              <TouchableOpacity style={styles.buyNow_modal} onPress={handleConfirm}>
                <Image source={icons.addcart} style={styles.cartIcon} contentFit="contain" />
                <Text style={styles.buyText}>Thêm vào giỏ</Text>
              </TouchableOpacity>
            )}
            {selectedAction === "buy" && (
              <TouchableOpacity style={styles.buyNow_modal} onPress={handleConfirm}>
                <Image source={icons.buy} style={styles.cartIcon} contentFit="contain" />
                <Text style={styles.buyText}>Mua ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductFooter;

// Style
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
  favorite: {
    alignItems: "center",
    paddingLeft:5
  },
  cart: {
    alignItems: "center",
  },
  text: {
    marginLeft: width * 0.02,
    fontSize: width * 0.025,
    color: "#000",
  },
  divider: {
    width: 1,
    height: width * 0.1,
    backgroundColor: "rgb(68, 68, 68)",
    marginHorizontal: width * 0.01,
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
    backgroundColor: "#FFFFFF",
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
    alignSelf: "flex-end",      // Căn phần tử này sang lề phải
    justifyContent: "flex-start",
  },

  // Modal
  modal_product: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.99,
    height: height * 0.58,
    backgroundColor: "white",
    padding: width * 0.04,
    borderRadius: width * 0.02,
  },
  modalBody: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(113, 112, 112, 0.11)",
    borderRadius: width * 0.025,
    width: width * 0.046,
    height: height * 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginBottom: height * 0.025,
  },
  modalTitle_product: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    width: width * 0.4,
  },
  option_product: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionWrapperColor: {
    width: width * 0.15,
    marginRight: width * 0.02,
    marginBottom: 10,
  },
  optionWrapperSize: {
    width: width * 0.25,
    marginRight: width * 0.02,
    marginBottom: width * 0.025,
  },
  optionButton: {
    padding: width * 0.02,
    backgroundColor: "#ddd",
    borderRadius: width * 0.01,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#ff9800",
  },
  optionText: {
    fontSize: width * 0.026,
  },
  cart_text: {
    borderTopWidth: 0.5,
    borderColor: "rgba(97, 97, 97, 1)",
    marginVertical: height * 0.01,
  },
  cart_icon: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.025,
  },
  quantity_product: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.4,
    height: height * 0.06,
    marginLeft: width * 0.25,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: width * 0.025,
    borderRadius: width * 0.011,
    marginHorizontal: width * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
  quantityNumber: {
    fontSize: width * 0.035,
    fontWeight: "bold",
  },
});
