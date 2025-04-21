import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';

export default function SalesSummary({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const items = ["555 Tuna", "Nescafe 3-in-1", "Lucky Me Instant Noodles", "Pantene Shampoo", "Minola Cooking Oil", "NFA Rice", "Surf Laundry Detergent", "Martha's Salt", "Mega Sardines", "Century Tuna"];

    // Dummy data
    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: items[i],
        price: (i + 1) * 15 + 30,  // Starting price around PHP 30, increases gradually
        quantity: 5 + i * 2,  // Quantities starting at 5, increasing by 2
        total: ((i + 1) * 15 + 30) * (5 + i * 2),
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: items[i],
        price: (i + 1) * 15 + 30,  // Starting price around PHP 30, increases gradually
        quantity: 10 + i * 3,  // Quantities starting at 10, increasing by 3
        total: ((i + 1) * 25 + 100) * (10 + i * 3),
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: items[i],
        price: (i + 1) * 15 + 30,  // Starting price around PHP 30, increases gradually
        quantity: 20 + i * 4,  // Quantities starting at 20, increasing by 4
        total: ((i + 1) * 50 + 250) * (20 + i * 4),
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
                        <Text className="w-20 text-black text-center">Php {item.price}</Text>
                        <Text className="w-20 text-black text-center">{item.quantity}</Text>
                        <Text className="w-20 text-black text-center">Php {item.total}</Text>
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
