import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import ItemProductOrder, { Order } from '../../components/order/item_product_order'
import { Ionicons } from '@expo/vector-icons';
import HeaderWithBack from '@/components/custom/headerTop';

const orderList: Order[] = [
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        name: 'Premium Tangerine Shirt',
        price: 200000,
        color: 'Vàng',
        size: 'L',
        quantity: 4,
    },
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        name: 'Denim Jacket',
        price: 350000,
        color: 'Xanh',
        size: 'M',
        quantity: 1,
    },
    {
        image: 'https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg',
        name: 'Casual Sneakers',
        price: 150000,
        color: 'Trắng',
        size: '42',
        quantity: 2,
    },
];

const OrderScreen = () => {
    return (
        <SafeAreaView style={styles.containerSafeArea}>
            <HeaderWithBack title="Giỏ hàng" />
            <View style={styles.container}>
                <View style={styles.containerInfo}>
                    <View style={styles.containerAdress}>
                        <Ionicons name="location" size={20} color="#FF8000" />
                        <Text style={styles.addressTitle}>Địa chỉ nhận hàng</Text>
                    </View>
                    <View style={styles.containerInfoUser}>
                        <Text style={styles.userInfo}>Tên khách hàng</Text>
                        <Text style={styles.userInfo}>012345678</Text>
                        <Ionicons name="create" size={30} color="#FF8000" />
                    </View>
                    <Text style={styles.addressInfo}>Địa chỉ nhận hàng</Text>
                </View>
                <FlatList
                    data={orderList}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ItemProductOrder {...item} />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            </View>
            <View style={styles.containerPayment}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalText}>Tổng thanh toán (8)</Text>
                    <Text style={styles.priceText}>đ1.600.000</Text>
                </View>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Giao hàng (1)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1
    },
    container: {
        flex: 1
    },
    containerInfo: {
        padding: 12,
        margin: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#eee',
        borderRadius: 16,
        gap: 4
    },
    containerAdress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    containerInfoUser: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    addressTitle: {
        fontSize: 22,
        color: '#FF8000',
    },
    userInfo: {
        flex: 1,
        fontSize: 18,
        fontWeight: '400'
    },
    addressInfo: {
        fontSize: 18,
        fontWeight: '400'
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

export default OrderScreen;
