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
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}

        <Text
          style={styles.description}
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
            <Text style={styles.toggle}>
              {expanded ? 'Rút gọn' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.separator} />
    </>
  );
};

export default ContentProduct;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.025,
    paddingTop: height * 0.005,
    paddingBottom: height * 0.02,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
    marginBottom: 10,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#444',
    fontWeight: '400',
  },
  toggle: {
    color: '#1976D2', // Xanh dương đậm
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 128, 0, 0.05)',
  },
  separator: {
    height: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
});