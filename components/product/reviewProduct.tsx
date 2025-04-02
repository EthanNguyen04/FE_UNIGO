import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


function formatNumber(value: number): string {
    if (value >= 1_000_000) {
      const millions = (value / 1_000_000).toFixed(1); // Lấy 1 số thập phân
      return `${millions}m`;
    } else if (value >= 1_000) {
      const thousands = (value / 1_000).toFixed(1);   // Lấy 1 số thập phân
      return `${thousands}k`;
    } else {
      // Nếu nhỏ hơn 1.000, trả về dạng nguyên gốc
      return value.toString();
    }
  }
interface ReviewProductProps {
  reviewCount: number;
  onPressSeeMore?: () => void;
}

const ReviewProduct: React.FC<ReviewProductProps> = ({
  reviewCount,
  onPressSeeMore,
}) => {
  return (
    <View style={styles.product_vote}>
      <View style={styles.vote_header}>
        {/* Bên trái: tiêu đề và số lượt đánh giá */}
        <View style={styles.vote}>
          <Text style={styles.title}>Đánh giá sản phẩm</Text>
          <Text style={styles.text_vote}>({formatNumber(reviewCount)})</Text>
        </View>

        {/* Bên phải: nút Xem thêm */}
        <TouchableOpacity style={styles.vote_icon} onPress={onPressSeeMore}>
          <Text style={styles.voteicon_text}>Xem thêm &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReviewProduct;

const styles = StyleSheet.create({
  product_vote: {
    // Có thể để flexDirection: 'row' hoặc không tuỳ ý
    // Nếu chỉ vote_header xử lý row, ta có thể để product_vote linh hoạt
    width: width * 0.9,
    alignItems: 'center',
    // Nếu cần marginLeft, marginTop,... tuỳ thiết kế
  },

  // Quan trọng: justifyContent: 'space-between' giúp chia 2 khối trái-phải
  vote_header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Đẩy nút "Xem thêm" sang bên phải
    width: '100%', 
  },
  vote: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: '500',
  },
  text_vote: {
    fontWeight: '400',
    // Thêm style nếu cần
  },
  vote_icon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteicon_text: {
    fontSize: width * 0.032,
    color: 'rgba(255, 126, 0, 1)',
    padding: 10,
  },
  voteicon_icon: {
    width: width * 0.04,
    height: height * 0.025,
    resizeMode: 'contain',
  },
});
