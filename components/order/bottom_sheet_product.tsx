import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface Props {
    visible: boolean;
    defaultColor?: string;
    defaultSize?: string;
    colors: string[];
    sizes: string[];
    onClose: () => void;
    onSelectColor?: (color: string) => void;
    onSelectSize?: (size: string) => void;

}
const BottomSheetProductOptions: React.FC<Props> = ({ visible, colors, sizes, defaultColor, defaultSize, onClose, onSelectColor, onSelectSize }) => {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            setSelectedColor(defaultColor || null);
            setSelectedSize(defaultSize || null);
        }
    }, [visible, defaultColor, defaultSize]);
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.container}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    {/* Color */}
                    <Text style={styles.title}>Màu sắc</Text>
                    <View style={styles.optionRow}>
                        {colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionBox, selectedColor === color && styles.selectedBox]}
                                onPress={() => {
                                    setSelectedColor(color);
                                    onSelectColor?.(color);
                                }}
                            >
                                <Text>{color}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Size */}
                    <Text style={styles.title}>Size</Text>
                    <View style={styles.optionRow}>
                        {sizes.map((size, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionBox, selectedSize === size && styles.selectedBox]}
                                onPress={() => {
                                    setSelectedSize(size);
                                    onSelectSize?.(size);
                                }}
                            >
                                <Text>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 12,
        paddingBottom: 20,
    },
    selectedBox: {
        backgroundColor: '#ff8000',
    },
    closeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionBox: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        marginBottom: 8,
    }
});

export default BottomSheetProductOptions;
