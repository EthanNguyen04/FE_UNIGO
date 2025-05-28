import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Im_URL } from "../../api";

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
  reviews?: Array<{
    user: {
      name: string;
      avatar: string;
    };
    product_variant: string;
    star: number;
    content: string;
    createdAt: string;
  }>;
  onPressSeeMore?: () => void;
}

const ReviewProduct: React.FC<ReviewProductProps> = ({
  reviewCount,
  reviews = [],
  onPressSeeMore,
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleSeeMore = () => {
    setShowAllReviews(true);
    if (onPressSeeMore) {
      onPressSeeMore();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đánh giá sản phẩm</Text>
        <Text style={styles.count}>({formatNumber(reviewCount)})</Text>
      </View>
      
      {reviews.length > 0 && (
        <>
          <View style={styles.reviewItem}>
            <View style={styles.userInfo}>
              <Image 
                source={reviews[0].user.avatar ? { uri: Im_URL + reviews[0].user.avatar } : require("../../assets/images/avatar.png")} 
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{reviews[0].user.name}</Text>
                <Text style={styles.variant}>{reviews[0].product_variant}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= reviews[0].star ? "star" : "star-outline"}
                  size={16}
                  color={star <= reviews[0].star ? "#FFD700" : "#ccc"}
                />
              ))}
            </View>
            {reviews[0].content && (
              <Text style={styles.comment}>{reviews[0].content}</Text>
            )}
            <Text style={styles.date}>{reviews[0].createdAt}</Text>
          </View>

          {showAllReviews && reviews.slice(1).map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.userInfo}>
                <Image 
                  source={review.user.avatar ? { uri: Im_URL + review.user.avatar } : require("../../assets/images/avatar.png")} 
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{review.user.name}</Text>
                  <Text style={styles.variant}>{review.product_variant}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= review.star ? "star" : "star-outline"}
                    size={16}
                    color={star <= review.star ? "#FFD700" : "#ccc"}
                  />
                ))}
              </View>
              {review.content && (
                <Text style={styles.comment}>{review.content}</Text>
              )}
              <Text style={styles.date}>{review.createdAt}</Text>
            </View>
          ))}
        </>
      )}

      {reviews.length > 1 && !showAllReviews && (
        <TouchableOpacity style={styles.vote_icon} onPress={handleSeeMore}>
          <Text style={styles.voteicon_text}>Xem thêm {reviews.length - 1} đánh giá &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReviewProduct;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  count: {
    fontSize: 15,
    color: '#666',
    marginLeft: 8,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  variant: {
    fontSize: 13,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  comment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  vote_icon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  voteicon_text: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '500',
    padding: 8,
  },
  voteicon_icon: {
    width: width * 0.04,
    height: height * 0.025,
    resizeMode: 'contain',
  },
});
