import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type QuantityPickerProps = {
    initialValue?: number;
    onChange?: (value: number) => void;
};

const QuantityPicker: React.FC<QuantityPickerProps> = ({
    initialValue = 1,
    onChange,
}) => {
    const [quantity, setQuantity] = useState<number>(initialValue < 1 ? 1 : initialValue);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onChange && onChange(newQuantity);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onChange && onChange(newQuantity);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleDecrement}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.button} onPress={handleIncrement}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 30,
        height: 30,
        backgroundColor: '#ff8000',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityText: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: '500'
    },
});

export default QuantityPicker;