import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ScrollView } from 'react-native';
import ItemFilterClothes from '../../../components/flash_sale/item_filter';
import ItemProduct from '../../../components/flash_sale/item_product';
import { Colors } from '@/constants/Colors';

const clothesList = [
    { id: 1, imageSource: require("@/assets/images/jacket.png"), label: "Áo khoác" },
    { id: 2, imageSource: require("@/assets/images/trouser.png"), label: "Quần dài" },
    { id: 3, imageSource: require("@/assets/images/short.png"), label: "Quần ngắn" },
    { id: 4, imageSource: require("@/assets/images/hoodie.png"), label: "Hoodie" },
    { id: 5, imageSource: require("@/assets/images/t_shirt.png"), label: "Áo phông" },
];
const products = [
    {
        image: "https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg",
        price: 100000,
        percentDiscount: 10,
        name: "Sản phẩm 1",
    },
    {
        image: "https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg",
        price: 200000,
        percentDiscount: 15,
        name: "Sản phẩm 2",
    },
    {
        image: "https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg",
        price: 300000,
        percentDiscount: 20,
        name: "Sản phẩm 3",
    },
];
const FlashSaleScreen = () => {
    const [selectedType, setSelectedType] = useState<number>(1);
    const onPressType = (id: number) => {
        setSelectedType(id);
    };
    return (
        <ScrollView style={{ backgroundColor: Colors.white }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Các sản phẩm giảm giá</Text>
                    <Image source={require("@/assets/images/unigo.png")} />
                </View>
                <FlatList
                    data={clothesList}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ItemFilterClothes id={item.id} imageSource={item.imageSource} label={item.label} selected={selectedType == item.id} onPress={() => onPressType(item.id)} />
                    )}
                    ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                />
                <FlatList
                    data={products}
                    numColumns={2}
                    horizontal={false}
                    columnWrapperStyle={{ gap: 10 }}
                    renderItem={({ item }) => (
                        <ItemProduct image={item.image} name={item.name} price={item.price} percentDiscount={item.percentDiscount} />
                    )}
                />
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 10,
        gap: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    },
    textHeader: {
        fontSize: 22,
        fontWeight: '700'
    },
    logoHeader: {
        width: 90,
        height: 30
    },
    filter: {

    }
})

export default FlashSaleScreen;
