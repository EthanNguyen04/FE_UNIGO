import React, { useState, useCallback, useEffect } from 'react'; 
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Alert, 
  FlatList, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import CartIcon from './CartIcon';

// Giả lập data local để filter gợi ý
const MOCK_PRODUCTS = [
  'Áo nam',
  'Áo nữ',
  'Quần jean',
  'Hoddi',
  'Túi xách',
  'Mắt kính thời trang',
  // ...
];

interface FixedHeaderProps {
  placeholder?: string;
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ placeholder = "Tìm sản phẩm" }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Clear khi focus lại màn
  useFocusEffect(
    useCallback(() => {
      setSearchText("");
      setSuggestions([]);
      setShowSuggestions(false);
    }, [])
  );

  // Hàm lọc gợi ý (có thể thay thành fetch API)
  const fetchSuggestions = (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Lọc từ MOCK_PRODUCTS
    const filtered = MOCK_PRODUCTS.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleChangeText = (text: string) => {
    setSearchText(text);
    fetchSuggestions(text);
  };

  const handleSuggestionPress = (item: string) => {
    setSearchText(item);
    setShowSuggestions(false);
    router.push({ pathname: '/listProduct', params: { query: item } });
  };

  const handleSubmitEditing = () => {
    if (searchText.trim().length === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập từ khóa");
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
          />
        </View>
        <CartIcon />
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text>{item}</Text>
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
    backgroundColor: "#fff",
    zIndex: 10,            // đưa lên trên
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  suggestionsContainer: {
    position: 'absolute',
    top: 60,               // điều chỉnh cho khớp với height headerContainer
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
