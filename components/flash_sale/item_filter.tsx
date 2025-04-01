import React from 'react';
import { StyleSheet, View, Image, Text, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Colors } from "@/constants/Colors";

interface TypeClothes {
    id: number;
    imageSource: ImageSourcePropType;
    label: string;
    selected?: boolean;
    onPress?: () => void;
}
const ItemFilterClothes: React.FC<TypeClothes> = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress} style={styles.container}>
        <View style={[styles.imageContainer, props.selected && styles.selectedContainer]}>
          <Image source={props.imageSource} style={styles.image} />
        </View>
        <Text>{props.label}</Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      borderRadius: 50,
      overflow: 'hidden', 
    },
    image: {
      width: 70,
      height: 70,
      resizeMode: 'cover',
    },
    selectedContainer: {
      borderColor: 'red',
      borderWidth: 2
    },
  });

export default ItemFilterClothes;
