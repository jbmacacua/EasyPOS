import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';

export default function SalesSummary({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Dummy data
    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Daily Product ${String.fromCharCode(65 + i)}`,
        price: 50 + i * 5,
        quantity: 10 + i * 2,
        total: (50 + i * 5) * (10 + i * 2),
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Weekly Product ${String.fromCharCode(75 - i)}`,
        price: 100 + i * 15,
        quantity: 20 + i * 3,
        total: (100 + i * 15) * (20 + i * 3),
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Monthly Product ${String.fromCharCode(85 + i)}`,
        price: 200 + i * 20,
        quantity: 30 + i * 4,
        total: (200 + i * 20) * (30 + i * 4),
    }));

    const totalOverall = products.reduce((sum, product) => sum + product.total, 0);

    useEffect(() => {
        setLoading(true);
        let data = activeTab === 'Daily' ? dailyData : activeTab === 'Weekly' ? weeklyData : monthlyData;
        setTimeout(() => {
            setProducts(data);
            setLoading(false);
        }, 1000);
    }, [activeTab]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3C80B4" />
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-gray-100 rounded-lg">
            <Text className="text-2xl font-bold text-[#3C80B4] mb-4">Most Sold Items ({activeTab})</Text>

            <View className="w-full border border-gray-300 rounded-lg overflow-hidden">
                {/* Table Header */}
                <View className="flex-row bg-[#1C547E] p-2">
                    <Text className="flex-1 font-bold text-white text-center">Product</Text>
                    <Text className="w-20 font-bold text-white text-center">Price</Text>
                    <Text className="w-20 font-bold text-white text-center">Quantity</Text>
                    <Text className="w-20 font-bold text-white text-center">Total</Text>
                </View>

                {/* Table Rows */}
                {products.map((item, index) => (
                    <View key={item.id} className={`flex-row flex-wrap items-center p-2 ${index % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'}`}>
                        <Text className="flex-1 text-black text-center">{item.name}</Text>
                        <Text className="w-20 text-black text-center">${item.price}</Text>
                        <Text className="w-20 text-black text-center">{item.quantity}</Text>
                        <Text className="w-20 text-black text-center">{item.total}</Text>
                    </View>
                ))}

                {/* Total Row */}
                <View className="flex-row bg-white p-2">
                    <Text className="flex-1 font-bold text-black text-right">Total</Text>
                    <Text className="w-20 font-bold text-black text-center">{totalOverall}</Text>
                </View>
            </View>
        </View>
    );
}
