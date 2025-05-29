import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Im_URL } from "../../api";

const { width, height } = Dimensions.get("window");

function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(1);
    return `${millions}m`;
  } else if (value >= 1_000) {
    const thousands = (value / 1_000).toFixed(1);
    return `${thousands}k`;
  } else {
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

  const renderStars = (rating: number) => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={16}
          color={star <= rating ? "#FFD700" : "#ccc"}
        />
      ))}
    </View>
  );

  const renderReview = (review: any, index: number) => (
    <View key={index} style={styles.reviewItem}>
      <View style={styles.userInfo}>
        <Image 
          source={review.user.avatar ? { uri: Im_URL + review.user.avatar } : require("../../assets/images/avatar.png")} 
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{review.user.name}</Text>
          <Text style={styles.variant}>{review.product_variant}</Text>
        </View>
      </View>
      {renderStars(review.star)}
      {review.content && (
        <Text style={styles.comment}>{review.content}</Text>
      )}
      <Text style={styles.date}>{review.createdAt}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Đánh giá sản phẩm</Text>
        <Text style={styles.count}>({formatNumber(reviewCount)})</Text>
      </View>
      
      {reviews.length > 0 ? (
        <ScrollView style={styles.reviewsContainer}>
          {renderReview(reviews[0], 0)}
          
          {showAllReviews && reviews.slice(1).map((review, index) => 
            renderReview(review, index + 1)
          )}
        </ScrollView>
      ) : (
        <View style={styles.noReviews}>
          <Text style={styles.noReviewsText}>Chưa có đánh giá nào</Text>
        </View>
      )}

      {reviews.length > 1 && !showAllReviews && (
        <TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMore}>
          <Text style={styles.seeMoreText}>
            Xem thêm {reviews.length - 1} đánh giá &gt;
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReviewProduct;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
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
  reviewsContainer: {
    maxHeight: 400,
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
  userDetails: {
    flex: 1,
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
  seeMoreButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '500',
    padding: 8,
  },
  noReviews: {
    padding: 20,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});