import React, { FC } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
interface Product {
    image: string,
    price: number,
    percentDiscount: number,
    name: string
}

const ItemProduct : FC<Product> = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.containerImage}>
                <View>
                    <Image source={{ uri: props.image }} style={styles.image} />
                    <View style={styles.containerDiscount}>
                        <Image source={require("@/assets/images/bg_sale_img.png")} style={styles.imageDiscount} />
                        <Text style={styles.textDiscount}>{`-${props.percentDiscount}%`}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.textLabel}>{props.name}</Text>
            <View style={styles.containerPrice}>
                <Text style={styles.textPrice}>{`${props.price} vnd`}</Text>
                <Text style={styles.textPriceOld}>{`${props.price} vnd`}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        gap: 10
    },
    containerImage: {
        width: (width - 30)/2,
        height: 200,
        padding: 4,
        backgroundColor: Colors.white,
        borderRadius: 8,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 6
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8
    },
    textLabel: {
        fontSize: 16,
        fontWeight: '500'
    },
    containerPrice: {
        flexDirection: 'row',
        gap: 20
    },
    textPrice: {
        fontSize: 12,
        fontWeight: "bold",
    },
    textPriceOld: {
        textDecorationLine: "line-through",
        color: "red",
        fontSize: 12,
        fontWeight: "bold",
    },
    containerDiscount: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0
    },
    imageDiscount: {
        width: 50,
        height: 25
    },
    textDiscount: {
        position: 'absolute',
        fontSize: 14,
        fontWeight: '500',
        color: Colors.white,
    }
})

export default ItemProduct;
