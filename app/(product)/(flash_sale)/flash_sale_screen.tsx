import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, Dimensions, } from 'react-native';
import ItemFilterClothes from '../../../components/flash_sale/item_filter';
import { Colors } from '@/constants/Colors';
import ItemProductSale from '../../../components/flash_sale/itemProductSale';
import { Image } from 'expo-image';
import HeaderWithBack from '@/components/custom/headerTop';

const screenWidth = Dimensions.get('window').width;

const clothesList = [
  { id: 1, label: "Áo khoác" },
  { id: 2, label: "Quần dài" },
  { id: 3, label: "Quần ngắn" },
  { id: 4, label: "Hoodie" },
  { id: 5, label: "Áo phông" },
];
const productsSale = [
  { id: "1", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "2", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://vulcano.sgp1.digitaloceanspaces.com/media/15404/conversions/ao-thun-1001-vulcano01-card_preview.webp" } },
  { id: "3", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphucpanda.com/wp-content/uploads/2024/09/947-ao-lop-polo-mix-co-v-bst-cool-ngau-ca-tinh-mau-xi-mang-1.jpg" } },
  { id: "4", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "5", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "6", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "7", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
  { id: "8", name: "Áo Khoác Phao", oldPrice: 1250000, newPrice: 1000000, discount: "20%", image: { uri: "https://dongphuchaianh.com/wp-content/uploads/2024/01/mau-ao-olop-polo-oversize-iconic-mau-trang.jpg" } },
];


const FlashSaleScreen = () => {
  const [selectedType, setSelectedType] = useState<number>(1);
  const onPressType = (id: number) => {
    setSelectedType(id);
  };
  return (
    <View style={styles.screenContainer}>
      <HeaderWithBack title="FLASH SALE" />

      {/* Header nằm ngoài ScrollView */}
      <View style={styles.header}>
        <Text style={styles.textHeader}>Các sản phẩm giảm giá</Text>
        <Image
          source={require("@/assets/images/unigo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      <View style={styles.list}>
        <FlatList
          data={clothesList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ItemFilterClothes
              id={item.id}
              label={item.label}
              selected={selectedType === item.id}
              onPress={() => onPressType(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
        />
      </View>
      <View style={styles.container}></View>
      <FlatList
        data={productsSale}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemProductSale product={item} />}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  list: {
    backgroundColor: "AEAEAE",
    paddingLeft: 5,
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
  filter: {

  },
  columnWrapper: {
    justifyContent: "space-around",
  },
})

export default FlashSaleScreen;
