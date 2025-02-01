import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

export default function MostSoldItems({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Separate arrays for dummy data
    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Daily Product ${String.fromCharCode(65 + i)}`, // A, B, C...
        sold: 50 + i * 5, // 50, 55, 60...
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Weekly Product ${String.fromCharCode(75 - i)}`, // K, J, I...
        sold: 100 + i * 15, // 100, 115, 130...
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Monthly Product ${String.fromCharCode(85 + i)}`, // U, V, W...
        sold: 200 + i * 20, // 200, 220, 240...
    }));

    useEffect(() => {
        setLoading(true); // Set loading to true before updating products

        let data = [];
        if (activeTab === 'Daily') {
            data = dailyData;
        } else if (activeTab === 'Weekly') {
            data = weeklyData;
        } else if (activeTab === 'Monthly') {
            data = monthlyData;
        }

        // Sort products by `sold` in descending order
        data.sort((a, b) => b.sold - a.sold);

        setTimeout(() => {
            setProducts(data); // Set the sorted data
            setLoading(false); // Stop loading after setting data
        }, 1000); // Simulating a 1-second delay
    }, [activeTab]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Render the list of top 10 sold products using ScrollView
    return (
        <View className="flex-1">
            <View className="p-5 bg-white rounded-lg shadow-md">
                <Text className="text-xl font-bold mb-3 text-[#3C80B4]">Most Sold Items</Text>
                <ScrollView>
                    {products.slice(0, 10).map((item, index) => (
                        <View
                            key={item.id}
                            className={`flex-row justify-between items-center pr-3 pl-3 pb-2 pt-2 ${index % 2 === 0 ? 'bg-[#3C80B4]' : 'bg-[#3F89C1]'
                                }`}
                        >
                            <Text className="text-[12px] font-medium text-white">{item.name}</Text>
                            <Text className="text-[12px] font-medium text-white">{item.sold} sold</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
