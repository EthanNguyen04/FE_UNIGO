import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface ContentProduct {
  // Tiêu đề phần mô tả, nếu bạn muốn tuỳ biến
  title?: string;
  // Nội dung mô tả
  description_text: string;
}

const ContentProduct: React.FC<ContentProduct> = ({
  title,
  description_text,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <View style={styles.description}>
        {/* Tiêu đề */}
        <Text style={styles.description_name}>{title}</Text>

        {/* Nội dung mô tả, có rút gọn */}
        <Text style={styles.description_text} numberOfLines={expanded ? undefined : 3}>
          {description_text}
        </Text>

        {/* Nút "Xem thêm / Rút gọn" */}
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeMoreText}>
            {expanded ? "Rút gọn" : "Xem thêm"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nếu bạn cần kẻ đường line dưới mô tả, tách view này ra */}
      <View style={styles.info_descriptonproduct} />
    </>
  );
};

export default ContentProduct;

// Style riêng cho ProductDescription
const styles = StyleSheet.create({
  description: {
    marginLeft: width * 0.04,
    width: width * 0.95,
  },
  description_name: {
    fontSize: 15,
    fontWeight: "500",
  },
  description_text: {
    marginLeft: width * 0.02,
    fontWeight: "400",
    marginTop: 10
  },
  seeMoreText: {
    fontSize: width * 0.04,
    color: "rgba(255, 136, 0, 0.6)", // 0.6 = 60% độ đậm, 40% trong suốt
    marginTop: height * 0.017,
    fontWeight: "400",
    padding: height * 0.01,
  },
  info_descriptonproduct: {
    borderTopWidth: width * 0.025,
    borderColor: "rgba(210, 213, 219, 0.94)",
  },
});
