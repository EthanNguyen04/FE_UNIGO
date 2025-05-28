import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}

interface ReviewProductProps {
  reviewCount: number;
  onPressSeeMore?: () => void;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  content: string;
  avatar: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    rating: 5,
    content: "Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    user: "Trần Thị B",
    rating: 4,
    content: "Hàng ổn trong tầm giá, sẽ ủng hộ lần sau.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    user: "Lê Văn C",
    rating: 3,
    content: "Tạm ổn, giao hơi chậm nhưng shop hỗ trợ nhiệt tình.",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
  },
];

const ReviewProduct: React.FC<ReviewProductProps> = ({ reviewCount, onPressSeeMore }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Đánh giá sản phẩm</Text>
          <Text style={styles.count}>({formatNumber(reviewCount)} đánh giá)</Text>
        </View>
        <TouchableOpacity onPress={onPressSeeMore}>
          <Text style={styles.seeMore}>Xem thêm &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách đánh giá */}
      <FlatList
        data={mockReviews}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.reviewContentWrapper}>
              <Text style={styles.userName}>{item.user}</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <AntDesign
                    key={i}
                    name={i < item.rating ? "star" : "staro"}
                    size={14}
                    color={i < item.rating ? "#FFD700" : "#ccc"}
                  />
                ))}
              </View>
              <Text style={styles.reviewContent}>{item.content}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ReviewProduct;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#222",
  },
  count: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  seeMore: {
    fontSize: 14,
    color: "#FF6F00",
    fontWeight: "500",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },
  reviewContentWrapper: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 6,
  },
  reviewContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});