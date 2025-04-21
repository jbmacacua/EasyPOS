import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

export default function MostSoldItems({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Separate arrays for realistic dummy data in the Philippines
    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: ["Pandesal", "Sachet Coffee", "Bottled Water", "Cup Noodles", "Soft Drinks", "Siomai", "Street BBQ", "Banana Cue", "Turon", "Corn on Cob"][i],
        sold: 30 + i * 10, // More realistic sales numbers
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: ["Rice (5kg)", "Cooking Oil (1L)", "Canned Sardines", "Instant Noodles Pack", "Eggs (1 dozen)"][i],
        sold: 80 + i * 20, // Weekly sales of common grocery items
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: ["Sack of Rice (25kg)", "Laundry Detergent (1.5kg)", "Toiletries Set", "Gasul LPG Tank", "Vitamin C Bottle", "Coffee Refill Pack", "Diapers Pack", "Shampoo Refill Pack"][i],
        sold: 150 + i * 30, // Monthly purchases with moderate variations
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
