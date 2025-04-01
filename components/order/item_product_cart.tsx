import React, { FC } from 'react';
import { StyleSheet, View, Image, Text, Touchable, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import QuantityPicker from './choose_quantity';
export interface Cart {
    image: string,
    price: number,
    name: string,
    type: String,
    color: String,
    onPress?: () => void,
    selected?: boolean;
}

const ItemProductCart: FC<Cart> = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <Image source={{ uri: props.image }} style={styles.image} />
            <View style={styles.containerInfo}>
                <View style={styles.containerName}>
                    <Text style={styles.textLabel}>{props.name}</Text>
                    <View style={[styles.radio, props.selected && styles.selected]} />
                </View>
                <View style={styles.containerType}>
                    <Text style={styles.textType}>
                        {props.color}, {props.type}
                    </Text>
                    <Ionicons name="arrow-down" size={12} color="black" />
                </View>
                <View style={styles.containerQuantity}>
                    <Text style={styles.textPrice}>
                        {props.price.toLocaleString('vi-VN')}đ
                    </Text>
                    <QuantityPicker
                        initialValue={1}
                        onChange={(value) => console.log('New quantity:', value)}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 8,
        marginHorizontal:12,
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 6,
        gap: 8
    },
    image: {
        borderRadius: 8,
        width: 100,
        height: 100,
        resizeMode: 'cover'
    },
    containerInfo: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 8
    },
    containerName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    containerType: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 8,
        backgroundColor: '#D9D9D9',
        padding: 4,
        gap: 4
    },
    containerQuantity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textLabel: {
        flex: 1,
        fontSize: 18
    },
    textType: {
        fontSize: 14,
        color: '#797780'
    },
    textPrice: {
        fontSize: 18,
        color: '#FF8000'
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    selected: {
        backgroundColor: 'orange',
        borderColor: 'orange',
    }
})

export default ItemProductCart;
