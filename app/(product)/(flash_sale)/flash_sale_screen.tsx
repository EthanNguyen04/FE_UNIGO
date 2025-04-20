import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import HeaderWithBack from '@/components/custom/headerBack';
import ItemProductSale from '../../../components/flash_sale/itemProductSale';
import { Colors } from '@/constants/Colors';
import { BASE_URL, Get_all_product_sale,Im_URL } from '../../../api';

const screenWidth = Dimensions.get('window').width;

const FlashSaleScreen = () => {
  const [productsSale, setProductsSale] = useState<ProductSale[]>([]);

  const [loading, setLoading] = useState(true);
  type ProductSale = {
    id: string;
    name: string;
    oldPrice: number;
    newPrice: number;
    discount: string;
    image: { uri: string };
  };
  
  const fetchSaleProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}${Get_all_product_sale}`);
      const data = await response.json();

      const fetchedData = data.products.map((item: any) => ({
        id: item.id,
        name: item.name,
        oldPrice: item.discount_price,
        newPrice: item.original_price,
        discount: `${item.discount}%`,
        image: { uri: `${Im_URL}${item.link}` }
      }));

      setProductsSale(fetchedData);
    } catch (error) {
      console.error("Lỗi khi gọi API getSaleProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <HeaderWithBack title="FLASH SALE" />

      <View style={styles.header}>
        <Text style={styles.textHeader}>Các sản phẩm giảm giá</Text>
        <Image
          source={require("@/assets/images/unigo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          data={productsSale}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemProductSale product={item} />}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    gap: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3
  },
  textHeader: {
    fontSize: 20,
    fontWeight: '700'
  },
  logo: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.1
  },
  columnWrapper: {
    justifyContent: "space-around",
  },
});

export default FlashSaleScreen;
