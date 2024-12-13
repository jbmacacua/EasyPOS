import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure you have this installed

export default function RestockItems({}) {
    const [loading, setLoading] = useState(true);

    // Item arrays for dummy data
    const items = [
        { id: '1', name: 'Item A', quantity: 10 },
        { id: '2', name: 'Item B', quantity: 15 },
        { id: '3', name: 'Item C', quantity: 20 },
        { id: '4', name: 'Item D', quantity: 25 },
        { id: '5', name: 'Item E', quantity: 30 },
        { id: '6', name: 'Item F', quantity: 35 },
        { id: '7', name: 'Item G', quantity: 40 },
        { id: '8', name: 'Item H', quantity: 45 },
        { id: '9', name: 'Item I', quantity: 50 },
        { id: '10', name: 'Item J', quantity: 55 },
    ];

    useEffect(() => {
        setLoading(false); // Simulating loading state
    }, []);

    // Render the list of items
    return (
        <View className="flex-1">
            <View className="p-5 bg-white rounded-lg shadow-md border-2 border-[#3C80B4]">
                <View className="flex-row items-center mb-3">
                    {/* Urgent Icon */}
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#FF6347" />
                    {/* Title with Urgency */}
                    <Text className="text-xl font-bold text-[#3C80B4] ml-2">Restock Items</Text>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <ScrollView>
                        {items.slice(0, 10).map((item, index) => (
                            <View
                                key={item.id}
                                className={`flex-row justify-between items-center pr-3 pl-3 pb-2 pt-2 ${index % 2 === 0 ? 'bg-[#3C80B4]' : 'bg-[#3F89C1]'
                                }`}
                            >
                                {/* Item Name */}
                                <Text className="text-[12px] font-medium text-white">{item.name}</Text>

                                {/* Quantity Left */}
                                <Text className="text-[12px] font-medium text-white">{item.quantity} left</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
