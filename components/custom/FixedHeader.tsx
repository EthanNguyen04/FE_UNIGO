import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';
import CartIcon from './CartIcon';

interface Product {
  _id: string;
  name: string;
}

interface FixedHeaderProps {
  placeholder?: string;
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ placeholder = 'Tìm sản phẩm' }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setSuggestions([]);
      setShowSuggestions(false);
    }, [])
  );

  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const url = `http://192.168.53.114:3001/api/product/searchProducts?name=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      // Giả định API trả về mảng products
      const products: Product[] = res.data.products || [];
      setSuggestions(products);
      setShowSuggestions(products.length > 0);
    } catch (error) {
      console.error('Lỗi lấy gợi ý:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleChangeText = (text: string) => {
    setSearchText(text);
    fetchSuggestions(text);
  };

  const handleSuggestionPress = (item: Product) => {
    setSearchText(item.name);
    setShowSuggestions(false);
    router.push({ pathname: '/listProduct', params: { query: item.name } });
  };

  const handleSubmitEditing = () => {
    if (searchText.trim().length === 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa');
      return;
    }
    setShowSuggestions(false);
    router.push({ pathname: '/listProduct', params: { query: searchText } });
  };

  return (
    <View style={styles.fixedHeader}>
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
            onFocus={() => fetchSuggestions(searchText)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <CartIcon />
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fixedHeader: {
    backgroundColor: '#fff',
    zIndex: 10,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    color: '#000',
    height: 40,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default FixedHeader;