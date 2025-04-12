import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DeliveredOrderItem from '@/components/order/item_delivered_order';
import HeaderWithBack from '@/components/custom/headerTop';

const tabs = ['Lấy Hàng', 'Đang Giao', 'Đã Giao', 'Đã Hủy'] as const;
type TabType = typeof tabs[number];

const DeliveredOrderScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Đã Giao');

  const renderContent = () => {
    switch (activeTab) {
      case 'Đã Giao':
        return (
          <ScrollView>
            <DeliveredOrderItem
              imageUrl="https://media.loveitopcdn.com/853/quan-dui-nam-dai-ong-con-xanh-den-bia.jpg"
              productName="Quần áo gì đó"
              price="240.000đ"
              quantity={2}
              onDetailPress={() => console.log('Xem chi tiết')}
            />
          </ScrollView>
        );
      default:
        return (
          <View style={styles.emptyView}>
            <Text style={{ fontSize: 16 }}>Danh sách trống</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title='Đơn hàng'/>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
    </View>
  );
};

export default DeliveredOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#444',
  },
  activeTabText: {
    color: '#FF8000',
    fontWeight: 'bold',
  },
  activeIndicator: {
    marginTop: 4,
    height: 2,
    width: 40,
    backgroundColor: '#FF8000',
    borderRadius: 1,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});