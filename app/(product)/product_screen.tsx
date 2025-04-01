import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Dimensions, FlatList, Animated, ScrollView, Modal, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = 250;

const images = [
  { id: '1', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
  { id: '2', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
  { id: '3', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
  { id: '4', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
  { id: '5', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
  { id: '6', uri: 'https://static.rain-mag.com/2023/05/Gucci-Summer-Stories-B1-DP-430x304-300DPI-1.jpg' },
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


const icons = {
  cart: require("../../assets/images/cart_img.png"),
};

const Product_screen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [selectedSize, setSelectedSize] = useState('XXL - (70 - 80kg)');
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  return (
    <View style={styles.Product_Screen}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Tìm sản phẩm" placeholderTextColor="#888" />
          </View>
          <TouchableOpacity style={styles.cartIconContainer}>
            <View style={styles.iconBackground}>
              <Image source={icons.cart} style={styles.ic_cart} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Product Image */}
      {/* Nội dung cuộn được */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Product Image */}
        <View style={styles.product_slide}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.image_product}>
                <Image source={{ uri: item.uri }} style={styles.image} />
              </View>
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
                listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / width);
                  setCurrentIndex(index + 1); // Cập nhật index (bắt đầu từ 1)
                },
              }
            )}
          />

          {/* Hiển thị số thứ tự ảnh */}
          <View style={styles.imageCounter}>
            <Text style={styles.counterText}>
              {currentIndex}/{images.length}
            </Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.product_info}>
          <View style={styles.product_price}>
            <View style={styles.price}>
              <Text style={styles.price_text}>1.000.000vnđ</Text>
              <Text style={styles.price_discount}>7.000.000</Text>
            </View>
            <View style={styles.money}>
              <Text style={styles.text_money}>Đã bán 123K sp</Text>
            </View>
          </View>
          <Text style={styles.product_name}>Áo thun nữ cộc tay nhún eo vạt chéo xoắn Eo Cổ Tròn CaMa Store M1176</Text>
          <View style={styles.info_descripton}></View>
        </View>

        {/* Product Description */}
        <View style={styles.description}>
          <Text style={styles.description_name}>Mô tả sản phẩm</Text>
          <Text style={styles.description_text} numberOfLines={expanded ? undefined : 3}>
            Áo thun nữ  cộc tay nhún eo vạt chéo , Xoắn Eo Cổ Tròn   CaMa Store M117
            Áo thun nữ năng động, xinh xắn luôn là sản phẩm yêu thích của các cô gái trẻ và chưa bao giờ bị xem là lỗi mốt theo thời gian. áo thun nữ tay ngắn,tay dài form rộng khiến việc vận động dễ dàng thoải mái giúp phái đẹp tham gia vào các hoạt động một cách tự tin hơn. Áo thun nữ có cổ dạng cổ tim,cổ vuông dáng ôm sẽ mang lại ấn tượng trẻ trung, khỏe khoắn cho người mặc. Những chiếc áo thun nữ cao cấp phù hợp cho mọi hoàn cảnh, bạn có thể mặc nó đến những bữa tiệc, dã ngoại ngoài trời hay ngay cả khi làm việc.
            Áo thun nữ form rộng không những không khiến người mặc trở nên luộm thuộm mà ngược lại, trông rất phong cách với kiểu dáng tay lỡ,tay dài. Và dĩ nhiên là áo thun nữ form rộng unisex giá rẻ in hình nữ tính mặc cũng rất thoải mái rồi. Đôi khi nhìn các cô nàng còn rất đáng yêu, khả ái nữa cơ.
            Áo thun nữ tay ngắn là một item không thể thiếu trong tủ đồ của những cô nàng sành điệu. Nhất là khi hè về, những mẫu áo phông nữ ngắn tay được thiết kế với dáng ôm hoặc form rộng cổ tròn in hình cá tính, đẹp mắt được sản xuất hàng loạt và nhanh chóng cháy hàng.
          </Text>

          {/* Nút Xem thêm / Rút gọn */}
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.seeMoreText}>
              {expanded ? "Rút gọn" : "Xem thêm"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.info_descriptonproduct}></View>
        {/* Product vote */}
        <View style={styles.product_vote}>
          <View style={styles.vote_header}>
            <View style={styles.like_voteproduct}>
              <Text style={{ fontSize: 20 }}>
                4.6<AntDesign name="star" size={16} color="gold" />
              </Text>
            </View>
            <View style={styles.vote}>
              <Text style={styles.title}>Đánh giá sản phẩm</Text>
              <Text>(3.2K)</Text>
            </View>
            <TouchableOpacity style={styles.vote_icon}>
              <Text style={styles.voteicon_text}>Tất cả</Text>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3114/3114931.png' }} style={styles.voteicon_icon}></Image>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {reviews.map((item) => (
              <View key={item.id} style={styles.vote_poduct}>
                <View style={styles.vote_view}>
                  <Image source={{ uri: item.avatar }} style={styles.vote_avatar} />
                  <View style={styles.info_vote}>
                    <Text style={styles.vote_text}>{item.name}</Text>
                    <View style={styles.like_vote}>
                      <Text>
                        (Đã đánh giá {item.rating} <AntDesign name="star" size={16} color="gold" />)
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.comment}>{item.comment}</Text>
                <View style={styles.info_descripton}></View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/* Product footer */}
      <View style={styles.footer}>
        {/* Yêu thích */}
        <TouchableOpacity
          style={styles.favorite}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <AntDesign
            name="heart"
            size={20}
            color={isFavorite ? 'red' : 'black'}
          />
          <Text style={styles.text}>
            {isFavorite ? 'Đã yêu thích' : 'Thêm vào Yêu thích'}
          </Text>
        </TouchableOpacity>

        {/* Giỏ hàng */}
        <View style={styles.divider} />
        <TouchableOpacity style={styles.cart} onPress={() => {
          setSelectedAction('cart');
          setModalVisible(true);
        }}>
          <FontAwesome name="shopping-basket" size={20} color="#ff9800" />
          <Text style={styles.text}>Thêm vào Giỏ hàng</Text>
        </TouchableOpacity>

        {/* Mua ngay */}
        <View style={styles.divider} />
        <TouchableOpacity style={styles.buyNow} onPress={() => {
          setSelectedAction('buy');
          setModalVisible(true);
        }}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/263/263142.png' }}
            style={styles.cartIcon}
          />
          <Text style={styles.buyText}>Mua ngay</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)} >
          <View style={styles.modal_product}>
            <View style={styles.modalContent}>
              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>Màu sắc</Text>
                <View style={styles.option_product}>
                  {['Trắng', 'Đen', 'Xám', 'Xanh', 'Vàng', 'Tím', 'Hồng'].map((color, index) => (
                    <View key={color} style={[styles.optionWrapperColor, index % 4 === 3 ? { marginRight: 0 } : {}]}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          selectedColor === color && styles.selectedOption
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
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
                    <View key={size} style={[styles.optionWrapperSize, index % 3 === 2 ? { marginRight: 0 } : {}]}>
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          selectedSize === size && styles.selectedOption
                        ]}
                        onPress={() => setSelectedSize(size)}
                      >
                        <Text style={styles.optionText}>{size}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* 🔥 Thêm phần chọn số lượng sản phẩm */}
                <Text style={styles.modalTitle}>Số lượng</Text>
                <View style={styles.quantity_product}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityNumber}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* 🔥 Nút chọn "Thêm vào giỏ hàng" hoặc "Mua ngay" */}

              </View>

              {/* 🔥 Button trong Modal sẽ hiển thị theo hành động được chọn */}
              {selectedAction === 'cart' && (
                <TouchableOpacity style={styles.buyNow_modal} onPress={() => setModalVisible(false)}>
                  <FontAwesome name="shopping-cart" size={20} color="white" />
                  <Text style={styles.buyText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
              )}

              {selectedAction === 'buy' && (
                <TouchableOpacity style={styles.buyNow_modal} onPress={() => setModalVisible(false)}>
                  <FontAwesome name="money" size={20} color="white" />
                  <Text style={styles.buyText}>Mua ngay</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>

    </View>
  )
}

export default Product_screen

const styles = StyleSheet.create({
  Product_Screen: { backgroundColor: 'rgba(255, 255, 255, 1)', flex: 1, marginTop: height * 0.026},
  header_product: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  icon_back: { width: width * 0.02, height: height * 0.017, padding: width * 0.035, margin: width * 0.035, resizeMode: 'center'},
  input_search: { backgroundColor: 'rgba(238, 237, 237, 1)', width: width * 0.60, height: height * 0.062, borderTopRightRadius: width * 0.02, borderBottomRightRadius: width * 0.02 },
  icon_search: { width: width * 0.05, height: height * 0.04, marginLeft: width * 0.02, resizeMode: 'center' },
  search: { flexDirection: 'row', alignItems: 'center' },
  select_search: { backgroundColor: 'rgba(238, 237, 237, 1)', height: height * 0.062, width: width * 0.083, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: width * 0.02, borderBottomLeftRadius: width * 0.02 },
  button_cart: { position: "relative", padding: width * 0.017, marginLeft: width * 0.017 },
  cart_icon: { position: "absolute", top: height * -0.004, right: -0.004, backgroundColor: "red", borderRadius: width * 0.04, width: width * 0.062, height: height * 0.026, justifyContent: "center", alignItems: "center", },
  text_cart: { color: "white", fontSize: width * 0.026, fontWeight: "bold", },
  cart_image: { width: width * 0.04, height: height * 0.025, resizeMode: 'center' },
  select_cart: { backgroundColor: 'rgba(238, 237, 237, 1)', width: width * 0.11, height: height * 0.062, borderRadius: width * 0.1, justifyContent: 'center', alignItems: 'center' },
  Slide: {
    borderRadius: width * 0.4,
    overflow: "hidden",
  },
  imageSlide: {
    width: width * 0.4,
    height: height * 0.4,
    resizeMode: "cover",
    borderRadius: width * 0.02,
  },
  product_slide: {
    alignItems: 'center',
    marginTop: height * 0.017,
  },
  image_product: {
    width,
    alignItems: 'center',
  },
  image: {
    width: width * 2.5,
    height: height * 0.32,
    resizeMode: 'center',
    borderRadius: width * 0.02,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: height * 0.017,
  },
  dot: {
    width: width * 0.032,
    height: height * 0.011,
    borderRadius: width * 0.04,
    backgroundColor: 'orange',
    marginHorizontal: width * 0.011,
  },
  product_info: { margin: width * 0.04 },
  product_name: { fontSize: width * 0.040 },
  product_price: { flexDirection: 'row', alignItems: 'center' },
  price: { flexDirection: 'row', width: width * 0.62, marginTop: height * 0.004, alignItems: 'center' },
  price_text: { color: '#ff0000', fontWeight: 'bold', marginRight: width * 0.02, fontSize: width * 0.046 },
  price_discount: { textDecorationLine: 'line-through', color: 'rgba(189, 189, 189, 1)', fontSize: width * 0.035 },
  like: { flexDirection: 'row', alignItems: 'center', marginLeft: width * 0.17 },
  money: { width: width * 0.95, marginLeft: width * 0.04 },
  text_money: { color: 'rgba(97, 97, 97, 1)', fontSize: width * 0.032, width: width * 0.32, alignItems: 'center', justifyContent: 'center' },
  info_view: { borderWidth: width * 0.0017, marginTop: height * 0.04 },
  description: { marginLeft: width * 0.04, width: width * 0.95 },
  description_name: { fontSize: width * 0.040, fontWeight: 'bold' },
  description_text: { marginLeft: width * 0.02 },
  info_descripton: { borderWidth: width * 0.0011, width: width * 0.95, marginTop: height * 0.025, borderColor: 'rgba(210, 213, 219, 0.94)' },
  product_vote: { marginLeft: width * 0.04 },
  vote_avatar: { width: width * 0.06, height: height * 0.06 },
  like_vote: { flexDirection: 'row', alignItems: 'center', marginLeft: width * 0.02 },
  vote_text: { width: width * 0.46, fontWeight: 'bold', fontSize: width * 0.032, marginLeft: width * 0.04 },
  info_vote: { flexDirection: 'row' },
  vote_view: { flexDirection: 'row', alignItems: 'center' },
  comment: {
    marginTop: height * 0.02,
    fontSize: width * 0.035,
    color: '#555',
    width: width * 0.95,
    height: height * 0.06,
  },
  vote_poduct: { paddingTop: height * 0.020, marginBottom: height * 0.02 },
  title: { fontSize: width * 0.040, marginTop: height * 0.02, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: width * 0.025,
    paddingHorizontal: width * 0.025,
    borderTopWidth: width * 0.0017,
    borderColor: '#ddd',
  },
  favorite: {
    alignItems: 'center',
  },
  cart: {
    alignItems: 'center',
  },
  text: {
    marginLeft: width * 0.02,
    fontSize: width * 0.025,
    color: '#000',
  },
  divider: {
    width: width * 0.0020,
    height: width * 0.062,
    backgroundColor: 'rgba(85, 85, 85, 1)',
    marginHorizontal: width * 0.02,
  },
  buyNow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    paddingVertical: width * 0.026,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
  },
  buyNow_modal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9800',
    paddingVertical: width * 0.026,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    width: width * 0.4,
    marginLeft: width * 0.46,
    marginTop: height * 0.02,
  },
  cartIcon: {
    width: width * 0.046,
    height: height * 0.04,
    marginRight: width * 0.04,
    resizeMode: 'center'
  },
  buyText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: width * 0.02
  },
  vote_header: { flexDirection: 'row', alignItems: 'center', width: width * 0.95 },
  vote_icon: { flexDirection: 'row' },
  voteicon_text: { fontSize: width * 0.032, color: 'rgba(255, 126, 0, 1)', marginLeft: width * 0.002 },
  voteicon_icon: { width: width * 0.04, height: height * 0.025, resizeMode: 'center' },
  modal_product: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: width * 0.95, height: height * 0.62, backgroundColor: 'white', padding: width * 0.04, borderRadius: width * 0.02 },
  modalTitle: { fontSize: width * 0.04, fontWeight: 'bold', marginBottom: height * 0.025 },
  optionRow: { flexDirection: 'row', marginBottom: height * 0.025 },
  option_product: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionWrapperColor: {
    width: width * 0.17, // 4 cột trên 1 dòng (22% mỗi cột)
    marginRight: width * 0.02, // Khoảng cách giữa các phần tử
    marginBottom: 10,
  },
  // Style cho Size (2 cột trên 1 dòng)
  optionWrapperSize: {
    width: width * 0.25, // 2 cột trên 1 dòng (45% mỗi cột)
    marginRight: width * 0.02, // Khoảng cách giữa các phần tử
    marginBottom: width * 0.025,
  },
  optionButton: {
    padding: width * 0.025,
    backgroundColor: '#ddd',
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#ff9800',
  },
  optionText: {
    fontSize: width * 0.026,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1, // Phần nội dung có thể mở rộng mà không làm di chuyển button
  },
  seeMoreText: {
    fontSize: width * 0.04,
    color: '#ff9800',
    marginTop: height * 0.017,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02
  },
  info_descriptonproduct: { borderTopWidth: width * 0.025, borderColor: 'rgba(210, 213, 219, 0.94)' },
  vote: { flexDirection: 'row', alignItems: 'center', marginRight: width * 0.20, width: width * 0.46, height: height * 0.062, marginLeft: width * 0.02 },
  like_voteproduct: { flexDirection: 'row', alignItems: 'center' },
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
  quantity_product: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.4,
    height: height * 0.06,
    bottom: height * 0.02,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: width * 0.035,
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.025,
  },
  quantityText: {
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  quantityNumber: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  fixedHeader: {
    backgroundColor: "#fff",
    zIndex: 1,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  cartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBackground: {
    width: 50, // Kích thước nền tròn
    height: 50,
    borderRadius: 50, // Làm tròn viền (bằng 1/2 width & height)
    backgroundColor: "#EEEDED", // Màu nền (đổi theo UI của bạn)
    justifyContent: "center",
    alignItems: "center",
  },
  
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  ic_cart: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
})