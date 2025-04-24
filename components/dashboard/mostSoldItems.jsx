import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import {
  getMostSoldItemsForDay,
  getMostSoldItemsForWeek,
  getMostSoldItemsForMonth
} from '@api/sales';
import { useSession } from '@context/auth';
import { useIsFocused } from '@react-navigation/native';

export default function MostSoldItems({ activeTab }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const { session, businessId } = useSession();
  const isFocused = useIsFocused();
  const userId = session ? JSON.parse(session)?.user?.id : null;

  const handleResponse = (response) => {
    if (response.success) {
      const transformedProducts = response.data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.product_price),
        quantity: parseInt(item.total_quantity),
        total: parseFloat(item.product_price) * parseInt(item.total_quantity),
      }));
      setProducts(transformedProducts);
    } else {
      console.error("Error fetching most sold items:", response.error);
      setProducts([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userId || !businessId) throw new Error("Missing user or business ID");

      if (activeTab === 'Daily') {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
        const response = await getMostSoldItemsForDay(userId, businessId, today);
        handleResponse(response);
      } else if (activeTab === 'Weekly') {
        const currentDate = new Date();
        const currentWeekNumber = Math.ceil(currentDate.getDate() / 7);
        const response = await getMostSoldItemsForWeek(userId, businessId, currentWeekNumber);
        handleResponse(response);
      } else if (activeTab === 'Monthly') {
        const response = await getMostSoldItemsForMonth(userId, businessId);
        handleResponse(response);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching most sold items:", err);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, userId, businessId]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3C80B4" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-100 rounded-lg">
      <Text className="text-2xl font-bold text-[#3C80B4] mb-4">
        Most Sold Items ({activeTab})
      </Text>

      <View className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <View className="flex-row bg-[#1C547E] p-2">
          <Text className="flex-1 font-bold text-white text-center">Product</Text>
          <Text className="w-20 font-bold text-white text-center">Price</Text>
          <Text className="w-20 font-bold text-white text-center">Quantity</Text>
          <Text className="w-20 font-bold text-white text-center">Total</Text>
        </View>
        {products.map((item, index) => (
          <View
            key={item.id}
            className={`flex-row flex-wrap items-center p-2 ${index % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'}`}
          >
            <Text className="flex-1 text-black text-center">{item.name}</Text>
            <Text className="w-20 text-black text-center">{item.price.toFixed(2)}</Text>
            <Text className="w-20 text-black text-center">{item.quantity}</Text>
            <Text className="w-20 text-black text-center">{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
