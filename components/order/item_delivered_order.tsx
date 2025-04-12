import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  imageUrl: string;
  productName: string;
  quantity: number;
  price: string;
  onDetailPress: () => void;
}

const DeliveredOrderItem: React.FC<Props> = ({
  imageUrl,
  productName,
  quantity,
  price,
  onDetailPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.quantity}>Số lượng: {quantity}</Text>
        </View>

        <TouchableOpacity onPress={onDetailPress}>
          <Text style={styles.detail}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Đã Giao</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    borderRadius: 12,
    resizeMode: 'cover',
    width: 100,
    height: 100
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
   marginBottom: 4,
  },
  price: {
    color: '#FF8000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quantity: {
    color: '#444',
  },
  detail: {
    color: '#FF8000',
    fontSize: 13,
    marginLeft: 6,
  },
  statusContainer: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#00cc00',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeliveredOrderItem;
