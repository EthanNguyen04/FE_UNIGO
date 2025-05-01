import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface TypeCate {
  id: string;
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

const ItemCate: React.FC<TypeCate> = (props) => {
  return (
    <TouchableOpacity 
      onPress={props.onPress} 
      style={[styles.container, props.selected && styles.selectedContainer]}
    >
      <Text style={styles.label}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  label: {
    fontSize: 10,
    color: '#333',
  },
  selectedContainer: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default ItemCate;
