import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartIcon from './CartIcon';  // Import CartIcon component

const FixedHeader = () => {

  return (
    <View style={styles.fixedHeader}>
      <View style={styles.headerContainer}>
        {/* Tìm kiếm */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm sản phẩm"
            placeholderTextColor="#888"
          />
        </View>

        {/* Giỏ hàng */}
        <CartIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedHeader: {
    backgroundColor: "#fff",
    zIndex: 1,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

export default FixedHeader;
