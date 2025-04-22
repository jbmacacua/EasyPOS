import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import {
    getMostSoldItemsForDay,
    getMostSoldItemsForWeek,
    getMostSoldItemsForMonth
} from '@api/sales';
import { useSession } from '@context/auth';

export default function SalesSummary({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const { session, businessId } = useSession();
    const userId = session ? JSON.parse(session)?.user?.id : null;

    const totalOverall = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                if (activeTab === 'Daily') {
                    const today = new Date().toISOString().split('T')[0];
                    const response = await getMostSoldItemsForDay(userId, businessId, today);
                    handleResponse(response);
                } else if (activeTab === 'Weekly') {
                    const currentDate = new Date();
                    const currentWeekNumber = Math.ceil(currentDate.getDate() / 7); // rough weekly split
                    const response = await getMostSoldItemsForWeek(userId, businessId, currentWeekNumber);
                    handleResponse(response);
                } else if (activeTab === 'Monthly') {
                    const response = await getMostSoldItemsForMonth(userId, businessId);
                    handleResponse(response);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching sales summary:", err);
                setProducts([]);
            }

            setLoading(false);
        };

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
                console.error("Error fetching sales data:", response.error);
                setProducts([]);
            }
        };

        fetchData();
    }, [activeTab, userId, businessId]);

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
                {/* Table Header */}
                <View className="flex-row bg-[#1C547E] p-2">
                    <Text className="flex-1 font-bold text-white text-center">Product</Text>
                    <Text className="w-20 font-bold text-white text-center">Price</Text>
                    <Text className="w-20 font-bold text-white text-center">Quantity</Text>
                    <Text className="w-20 font-bold text-white text-center">Total</Text>
                </View>

                {/* Table Rows */}
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

                {/* Total Row */}
                <View className="flex-row bg-white p-2">
                    <Text className="flex-1 font-bold text-black text-right">Total</Text>
                    <Text className="w-20 font-bold text-black text-center">{totalOverall.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
}
