import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image"; // Dùng expo-image để load ảnh từ URL
import CardviewProductSuggest from "../../components/home/CardviewProductSuggest";
import FixedHeader from "@/components/custom/FixedHeader";
// Lưu ý: các endpoint dưới đây phải được định nghĩa đúng trong file ../../api
import { BASE_URL, Get_All_product, Get_all_cate } from "../../api";
import ItemCate from "@/components/flash_sale/item_filter";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

interface ProductSuggest {
  id: string;
  link: string;
  name: string;
  original_price: number;
  discount_price: number;
  discount: number;
}

interface Category {
  _id: string;
  name: string;
  status: boolean;
  __v?: number;
}

export default function ListProduct() {
  const [productsSuggest, setProductsSuggest] = useState<ProductSuggest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Chọn danh mục từ giao diện (nếu không có idCategory từ route)
  const [selectedType, setSelectedType] = useState<string | null>(null);
  // 0: mặc định, 1: giá tăng dần, 2: giá giảm dần
  const [priceSort, setPriceSort] = useState<number>(0);

  const router = useRouter();
  // Lấy các tham số từ route: query và idCategory (nếu có)
  const { query, idCategory: idCategoryParam } = useLocalSearchParams<{
    query?: string;
    idCategory?: string;
  }>();

  // Hàm gọi API cho danh sách sản phẩm theo searchProducts
  const fetchProducts = async () => {
    try {
      // Sử dụng endpoint searchProducts theo cấu trúc API của server
      let url = `${BASE_URL}${Get_All_product}`;
      const params: string[] = [];
      
      // Nếu có tham số page bạn có thể thêm: 
      // params.push(`page=1`);

      // Nếu có query (tên sản phẩm cần tìm)
      if (query && query.trim().length > 0) {
        params.push(`name=${encodeURIComponent(query.trim())}`);
      }
      
      // Ưu tiên dùng idCategory từ route nếu có, nếu không thì lấy từ state selectedType
      const idCategory = idCategoryParam || selectedType;
      if (idCategory) {
        params.push(`idCategory=${encodeURIComponent(idCategory)}`);
      }
      
      // Nếu có sắp xếp giá (priceSort khác 0) thì thêm tham số sortByPrice
      if (priceSort !== 0) {
        params.push(`sortByPrice=${priceSort === 1 ? "asc" : "desc"}`);
      }
      
      if (params.length > 0) {
        url += "?" + params.join("&");
      }
      
      console.log("Fetching products from:", url);
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // API trả về đối tượng có các trường: message, page, perPage, totalPages, totalCount, products
        setProductsSuggest(data.products);
      } else {
        Alert.alert("Error", data.message || data.error || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Có lỗi xảy ra khi tải dữ liệu sản phẩm.");
    }
    setIsLoading(false);
  };

  // Gọi API mỗi khi các tham số thay đổi: query, idCategory từ route, selectedType hoặc priceSort
  useEffect(() => {
    fetchProducts();
  }, [query, idCategoryParam, selectedType, priceSort]);

  // Gọi API lấy danh mục (không có tham số lọc)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${BASE_URL}${Get_all_cate}`;
        const response = await fetch(url);
        const data = await response.json();
console.log("ta"+data)
        if (response.ok) {
          setCategories(data.categories);
        } else {
          Alert.alert("Error", data.message || data.error || "Something went wrong");
        }
      } catch (error: any) {
        //console.error("Error fetching categories:", error);
        Alert.alert("Error", "Có lỗi xảy ra khi tải dữ liệu danh mục.");
      }
    };

    fetchCategories();
  }, []);

  // Khi người dùng chọn danh mục từ giao diện
  const onPressType = (id: string) => {
    // Nếu id đã được chọn thì bỏ chọn (setSelectedType null)
    if (selectedType === id) {
      setSelectedType(null);
      console.log("Unselected category id:", id);
    } else {
      setSelectedType(id);
      console.log("Selected category id:", id);
    }
  };
  
  // Handler cho sắp xếp giá: luân chuyển qua 3 trạng thái (0, 1, 2)
  const handlePriceSortToggle = () => {
    setPriceSort((prev) => (prev + 1) % 3);
  };

  // Nếu API đã sắp xếp sản phẩm theo giá khi có sortByPrice, phần này có thể dùng để sắp xếp lại (nếu cần)
  const sortedProducts = useMemo(() => {
    let list = [...productsSuggest];
    if (priceSort === 1) {
      list.sort((a, b) => a.discount_price - b.discount_price);
    } else if (priceSort === 2) {
      list.sort((a, b) => b.discount_price - a.discount_price);
    }
    return list;
  }, [priceSort, productsSuggest]);

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <FixedHeader placeholder={query ? query : undefined} />

      {/* Hàng danh mục và icon "Giá" */}
      <View style={styles.categoryRow}>
        <TouchableOpacity onPress={handlePriceSortToggle} style={styles.priceButton}>
          <Text style={styles.priceLabel}>Giá</Text>
          {priceSort === 0 && (
            <Ionicons name="funnel-outline" size={16} color="#333" />
          )}
          {priceSort === 1 && (
            <Ionicons name="arrow-up-outline" size={16} color="#FF8000" />
          )}
          {priceSort === 2 && (
            <Ionicons name="arrow-down-outline" size={16} color="#FF8000" />
          )}
        </TouchableOpacity>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ItemCate
              id={item._id}
              label={item.name}
              selected={selectedType === item._id || idCategoryParam === item._id}
              onPress={() => onPressType(item._id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>

      {/* Danh sách sản phẩm */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF8000" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FlatList
            data={sortedProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <CardviewProductSuggest
                product={{
                  id: item.id,
                  image: { uri: item.link },
                  name: item.name,
                  // Nếu cần điều chỉnh giá hiển thị, các trường này đã được tính từ API
                  original_price: item.discount_price,
                  discount_price: item.original_price,
                  discount: item.discount,
                }}
                onPress={() => {
                  router.push(`/product_screen?idp=${encodeURIComponent(item.id)}`);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 40,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  priceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  priceLabel: {
    fontSize: 12,
    color: "#333",
    marginRight: 4,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
