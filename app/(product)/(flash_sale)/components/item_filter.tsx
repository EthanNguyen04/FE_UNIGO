import React from 'react';
import { StyleSheet, View, Image, Text, ImageSourcePropType } from 'react-native';
import { Colors } from "@/constants/Colors";

interface TypeClothes {
    imageSource: ImageSourcePropType;
    label?: string;
}
const ItemFilterClothes: React.FC<TypeClothes> = (props) => {
    return (
        <View style={styles.container}>
            <Image source={props.imageSource} style={styles.image} />
            <Text>{props.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: 70,
        height: 70,
        resizeMode: "cover",
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 6,
    },
})

export default ItemFilterClothes;
