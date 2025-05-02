import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const icons = {
  done: require("../../assets/images/done_ic.png"), // dùng khi active = true
  fail: require("../../assets/images/fail_ic.png"), // dùng khi active = false
};

interface NotiInAppProps {
  active: boolean;
  title: string;
  onHide?: () => void;
}

const NotiInApp: React.FC<NotiInAppProps> = ({ active, title, onHide }) => {
  const translateY = useRef(new Animated.Value(-100)).current; // Bắt đầu ẩn phía trên màn hình

  useEffect(() => {
    if (active) {
      // Hoạt ảnh: trượt xuống, hiển thị trong 2 giây, sau đó trượt lên ẩn đi.
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(9999999999999),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide && onHide();
      });
    }
  }, [active, onHide, translateY]);

  // Chọn hình ảnh dựa trên giá trị active
  const imageUrl = active ? icons.done : icons.fail;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: screenWidth * 0.9,
    position: 'absolute',
    alignSelf: 'center', // Center theo ngang
    backgroundColor: '#FF8000',
    marginTop: 50,
    alignItems: 'center',
    zIndex: 1000,
    borderRadius: 10,
    paddingVertical: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,

  },
  image: {
    width: screenWidth * 0.09,
    height: screenWidth * 0.09,
    marginLeft: 10,

  },
});

export default NotiInApp;
