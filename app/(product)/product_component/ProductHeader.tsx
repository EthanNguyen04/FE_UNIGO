import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

interface ProductHeaderProps {
    navigation: any;
    cartItemCount: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ navigation, cartItemCount }) => {
    const [searchText, setSearchText] = useState("");
    return (
        <View style={styles.header_product}>
            <TouchableOpacity>
                <Image source={require('../assets_product/back_btn.png')} style={styles.icon_back}></Image>
            </TouchableOpacity>
            <View style={styles.search}>
                <TouchableOpacity style={styles.select_search}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/151/151773.png' }} style={styles.icon_search}></Image>
                </TouchableOpacity>
                <TextInput placeholder='Tìm sản phẩm' style={styles.input_search} value={searchText} onChangeText={setSearchText}></TextInput>
                {searchText.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={() => setSearchText("")}>
                        <Text style={styles.clearText}>K</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.button_cart}>
                <View style={styles.select_cart}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1170/1170678.png' }} style={styles.cart_image} />
                </View>
                <View style={styles.cart_icon}>
                    <Text style={styles.text_cart}>10</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header_product: { flexDirection: 'row', alignItems: 'center', marginTop: 10},
    icon_back: { width: width * 0.02, height: height * 0.017, padding: width * 0.035, margin: width * 0.035 },
    input_search: { backgroundColor: 'rgba(238, 237, 237, 1)', width: width * 0.60, height: height * 0.062, borderTopRightRadius: width * 0.02, borderBottomRightRadius: width * 0.02 },
    icon_search: { width: width * 0.05, height: height * 0.04, marginLeft: width * 0.02, resizeMode: 'center' },
    search: { flexDirection: 'row', alignItems: 'center' },
    select_search: { backgroundColor: 'rgba(238, 237, 237, 1)', height: height * 0.062, width: width * 0.083, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: width * 0.02, borderBottomLeftRadius: width * 0.02 },
    button_cart: { position: "relative", padding: width * 0.017, marginLeft: width * 0.017 },
    cart_icon: { position: "absolute", top: height * -0.004, right: -0.004, backgroundColor: "red", borderRadius: width * 0.04, width: width * 0.062, height: height * 0.026, justifyContent: "center", alignItems: "center", },
    text_cart: { color: "white", fontSize: width * 0.026, fontWeight: "bold", },
    cart_image: { width: width * 0.04, height: height * 0.025, resizeMode: 'center' },
    select_cart: { backgroundColor: 'rgba(238, 237, 237, 1)', width: width * 0.11, height: height * 0.062, borderRadius: width * 0.1, justifyContent: 'center', alignItems: 'center' },
    clearButton: {
        position: 'absolute',
        right: width * 0.02,
        top: '35%',
        transform: [{ translateY: -height * 0.012 }],
        backgroundColor: 'rgb(100, 99, 99)',
        width: width * 0.06,
        height: width * 0.06,
        borderRadius: width * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProductHeader;