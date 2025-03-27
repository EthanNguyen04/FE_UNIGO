import React, { FC } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

export interface Order {
    image: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
};

const ItemProductOrder: FC<Order> = (props) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: props.image }} style={styles.image} />
            <View style={styles.containerInfo}>
                <View style={styles.containerHeader}>
                    <Text style={styles.textName} numberOfLines={1} ellipsizeMode="tail">{props.name}</Text>
                    <Text style={styles.textPrice}>{props.price} vnd</Text>
                </View>
                <Text style={styles.textTypeSize}>Màu: {props.color}</Text>
                <View style={styles.containerFooter}>
                    <Text style={styles.textTypeSize}>Size: {props.size}</Text>
                    <Text style={styles.textQuantity}>Số lượng: {props.quantity}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        marginHorizontal: 12,
        gap: 8
    },
    image: {
        borderRadius: 12,
        resizeMode: 'cover',
        width: 100,
        height: 100
    },
    containerInfo: {
        flex: 1,
        gap: 4
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    containerBody: {
        flexDirection: 'row'
    },
    containerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textName: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
    },
    textPrice: {
        fontSize: 18,
        fontWeight: '600'
    },
    textTypeSize: {
        fontSize: 14,
        fontWeight: '400',
        color: '#797780',
        alignSelf: 'flex-start'
    },
    textQuantity: {
        fontSize: 14,
        fontWeight: '400'
    }
})

export default ItemProductOrder;
