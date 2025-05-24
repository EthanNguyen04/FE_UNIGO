import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ContentProduct {
  title?: string;
  description_text: string;
}

const ContentProduct: React.FC<ContentProduct> = ({ title, description_text }) => {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  return (
    <>
      <View style={styles.description}>
        {title && <Text style={styles.description_name}>{title}</Text>}

        <Text
          style={styles.description_text}
          numberOfLines={expanded ? undefined : 3}
          onTextLayout={e => {
            if (!showToggle && e.nativeEvent.lines.length > 3) {
              setShowToggle(true);
            }
          }}
        >
          {description_text}
        </Text>

        {showToggle && (
          <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
            <Text style={styles.seeMoreText}>
              {expanded ? 'Rút gọn' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
    marginTop: 10,
    marginBottom: 15,
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
