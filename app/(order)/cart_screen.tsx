import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ItemProductCart from '../../components/order/item_product_cart';
import { Cart } from '../../components/order/item_product_cart';
import HeaderWithBack from '@/components/custom/headerTop';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialCartData: Cart[] = [
    {
        id: 1,
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 200000,
        name: 'Premium Tangerine Shirt',
        type: 'Shirt',
        color: 'Yellow',
        quantity: 1,
        colors: ['Trắng', 'Vàng', 'Xanh Dương'],
        sizes: ['S', 'M', 'L', 'XL'],
        selectedColor: 'Vàng',
        selectedSize: 'M',
        onRemove: () => console.log('Sản phẩm Premium Tangerine Shirt được click'),
    },
    {
        id: 2,
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 350000,
        name: 'Stylish Denim Jacket',
        type: 'Jacket',
        color: 'Blue',
        quantity: 1,
        colors: ['Trắng', 'Vàng', 'Xanh Dương'],
        sizes: ['S', 'M', 'L', 'XL'],
        selectedColor: 'Xanh Dương',
        selectedSize: 'L',
        onRemove: () => console.log('Sản phẩm Stylish Denim Jacket được click'),
    },
    {
        id: 3,
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        price: 150000,
        name: 'Casual Sneakers',
        type: 'Sneakers',
        color: 'White',
        quantity: 1,
        colors: ['Trắng', 'Vàng', 'Xanh Dương'],
        sizes: ['S', 'M', 'L', 'XL'],
        selectedColor: 'Trắng',
        selectedSize: 'S',
        onRemove: () => console.log('Sản phẩm Casual Sneakers được click'),
    },
];
const CartScreen = () => {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [cartData, setCartData] = useState<Cart[]>(initialCartData);

    const updateQuantity = (index: number, newQuantity: number) => {
        setCartData((prevCartData) =>
            prevCartData.map((item, idx) =>
                idx === index ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleRemoveItem = (id: number) => {
        setCartData(prevData => prevData.filter(item => item.id !== id));
    }


    const renderItem = ({ item, index }: { item: Cart; index: number }) => (
        <ItemProductCart
            {...item}
            selected={selectedItems.includes(index)}
            onRemove={() => handleRemoveItem(item.id)}
            onChangeQuantity={(newQuantity: number) => updateQuantity(index, newQuantity)}
        />
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderWithBack title='Giỏ hàng'/>
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
                    <Text style={styles.totalText}>Tổng thanh toán ({cartData.length})</Text>
                    <Text style={styles.priceText}>đ{calculateTotal().toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Mua hàng</Text>
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
    }
})

export default CartScreen;
