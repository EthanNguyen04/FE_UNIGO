import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

interface ReviewList {
  reviews: ReviewItem[];
}

const ReviewList: React.FC<ReviewList> = ({ reviews }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reviews.map((item) => (
        <View key={item.id} style={styles.vote_poduct}>
          <View style={styles.vote_view}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.vote_avatar}
              // Nếu bạn đang dùng expo-image, bạn có thể dùng contentFit="cover"
            />
            <View style={styles.info_vote}>
              <Text style={styles.vote_text}>{item.name}</Text>
                <Text style={styles.like_vote}>
                  {item.rating} <AntDesign name="star" size={16} color="gold" />
                </Text>
            </View>
          </View>

          <Text style={styles.comment}>{item.comment}</Text>
          <View style={styles.info_descripton} />
        </View>
      ))}
    </ScrollView>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  vote_poduct: {
    marginTop: 10,
  },
  vote_view: {
    flexDirection: "row",
    alignItems: "center",
  },
  vote_avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 30,
    marginRight: width * 0.02,
  },
  info_vote: {
    flexDirection: "column",
    color: "#616161"
  },
  vote_text: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#3C3C3C",
  },
  like_vote: {
    flexDirection: "row",
    alignItems: "center",
    color: "#3C3C3C",
  },
  comment: {
    marginTop: 10,
    fontSize: 12,
    color: "#3C3C3C",
  },
  info_descripton: {
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "rgba(210, 213, 219, 0.94)",
    width: width * 0.9
  },
});
