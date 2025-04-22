import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getMostSoldItemsForDay, getMostSoldItemsForWeek, getMostSoldItemsForMonth } from '@api/sales';


export default function MostSoldItems({ activeTab, userId, businessId }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result;

      try {
        if (!userId || !businessId) throw new Error('Missing user or business ID');

        if (activeTab === 'Daily') {
          const today = new Date().toISOString().split('T')[0]; // Get current date as "YYYY-MM-DD"
          result = await getMostSoldItemsForDay(userId, businessId, today);
        } else if (activeTab === 'Weekly') {
          const weekNumber = Math.ceil(new Date().getDate() / 7);
          result = await getMostSoldItemsForWeek(userId, businessId, weekNumber);
        } else if (activeTab === 'Monthly') {
          result = await getMostSoldItemsForMonth(userId, businessId);
        }

        if (result?.success) {
          const sorted = result.data.sort((a, b) => b.total_quantity_sold - a.total_quantity_sold);
          setProducts(sorted);
        } else {
          console.error(result?.error);
          setProducts([]);
        }
      } catch (err) {
        console.error('MostSoldItems error:', err);
        setProducts([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="p-5 bg-white rounded-lg shadow-md">
        <Text className="text-xl font-bold mb-3 text-[#3C80B4]">Most Sold Items</Text>
        <ScrollView>
          {products.slice(0, 10).map((item, index) => (
            <View
              key={item.product_id}
              className={`flex-row justify-between items-center pr-3 pl-3 pb-2 pt-2 ${
                index % 2 === 0 ? 'bg-[#3C80B4]' : 'bg-[#3F89C1]'
              }`}
            >
              <Text className="text-[12px] font-medium text-white">{item.product_name}</Text>
              <Text className="text-[12px] font-medium text-white">{item.total_quantity_sold} sold</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
