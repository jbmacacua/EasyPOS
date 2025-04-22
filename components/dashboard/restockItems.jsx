import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getItemsNeededToRestock } from '@api/sales'; 
import { useSession } from '@context/auth'; 

export default function RestockItems() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    const { session, businessId } = useSession();
    const userId = session ? JSON.parse(session)?.user?.id : null;

    useEffect(() => {
        const fetchItems = async () => {
            if (!userId || !businessId) return;

            setLoading(true);

            const result = await getItemsNeededToRestock(userId, businessId);

            if (result.success) {
                setItems(result.data || []);
                setError(null);
            } else {
                setError(result.error?.message || 'Failed to fetch restock items.');
            }

            setLoading(false);
        };

        fetchItems();
    }, [userId, businessId]);

    return (
        <View className="flex-1">
            <View className="p-5 bg-white rounded-lg shadow-md border-2 border-[#3C80B4]">
                <View className="flex-row items-center mb-3">
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#FF6347" />
                    <Text className="text-xl font-bold text-[#3C80B4] ml-2">Restock Items</Text>
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : error ? (
                    <Text className="text-red-500">{error}</Text>
                ) : items.length === 0 ? (
                    <Text className="text-gray-500 text-center">All items are sufficiently stocked!</Text>
                ) : (
                    <ScrollView>
                        {items.map((item, index) => (
                            <View
                                key={item.id}
                                className={`flex-row justify-between items-center pr-3 pl-3 pb-2 pt-2 ${
                                    index % 2 === 0 ? 'bg-[#3C80B4]' : 'bg-[#3F89C1]'
                                }`}
                            >
                                <Text className="text-[12px] font-medium text-white">{item.name}</Text>
                                <Text className="text-[12px] font-medium text-white">{item.total_quantity_since_restock} left</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
