import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ItemProductCart from '../../components/order/item_product_cart';
import { Cart } from '../../components/order/item_product_cart';
import HeaderWithBack from '@/components/custom/headerTop';

const cartData: Cart[] = [
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 200000,
        name: 'Premium Tangerine Shirt',
        type: 'Shirt',
        color: 'Yellow',
        onPress: () => console.log('Sản phẩm Premium Tangerine Shirt được click'),
    },
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 350000,
        name: 'Stylish Denim Jacket',
        type: 'Jacket',
        color: 'Blue',
        onPress: () => console.log('Sản phẩm Stylish Denim Jacket được click'),
    },
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 150000,
        name: 'Casual Sneakers',
        type: 'Sneakers',
        color: 'White',
        onPress: () => console.log('Sản phẩm Casual Sneakers được click'),
    },
];
const CartScreen = () => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const handleSelectItem = (index: number) => {
        setSelectedItems((prevSelected) => {
          if (prevSelected.includes(index)) {
            return prevSelected.filter((i) => i !== index);
          } else {
            return [...prevSelected, index];
          }
        });
      };
      const renderItem = ({ item, index }: { item: Cart; index: number }) => (
        <ItemProductCart 
          {...item} 
          selected={selectedItems.includes(index)} 
          onPress={() => handleSelectItem(index)}
        />
      );
    return (
        <SafeAreaView style={styles.safeArea}>
             <HeaderWithBack title="Giỏ hàng" />
            <View style={styles.container} >
                <FlatList
                    data={cartData}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />

            </View>
            <View style={styles.containerPayment}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalText}>Tổng thanh toán (8)</Text>
                    <Text style={styles.priceText}>đ1.600.000</Text>
                </View>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Mua hàng (1)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    container: {
        flex: 1,
        paddingTop: 12
    },
    containerPayment: {
        backgroundColor: '#fff',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        gap: 4
    },
    totalText: {
        fontSize: 14,
        color: '#333',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6600',
    },
    buyButton: {
        backgroundColor: '#FF6600',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
})

export default CartScreen;
