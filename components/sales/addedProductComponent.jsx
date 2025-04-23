import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createSales } from '@api/sales';
import { useSession } from '@context/auth';

const AddedProductComponent = () => {
    const [addedProducts, setAddedProducts] = useState([]);
    const { session, businessId } = useSession();
    const router = useRouter();
    const userId = session ? JSON.parse(session)?.user?.id : null;

    const { items } = useLocalSearchParams();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                let parsed = [];
                if (items) {
                    parsed = JSON.parse(items);
                } else {
                    const storedProducts = await AsyncStorage.getItem("addedProducts");
                    if (storedProducts) {
                        parsed = JSON.parse(storedProducts);
                    }
                }
                setAddedProducts(parsed);
                await AsyncStorage.setItem("addedProducts", JSON.stringify(parsed)); // Optional cache
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };

        loadProducts();
    }, [items]);

    const updateQuantity = (index, change) => {
        const updated = [...addedProducts];
        updated[index].quantity = Math.max(0, updated[index].quantity + change);
        setAddedProducts(updated);
        AsyncStorage.setItem("addedProducts", JSON.stringify(updated));
    };

    const handleDelete = (index) => {
        const updated = addedProducts.filter((_, i) => i !== index);
        setAddedProducts(updated);
        AsyncStorage.setItem("addedProducts", JSON.stringify(updated));
    };

    const handleCancel = async () => {
        try {
            await AsyncStorage.removeItem("addedProducts");
            setAddedProducts([]);
            router.push('/main/sales');
        } catch (error) {
            console.error("Error clearing added products:", error);
        }
    };

    const handleConfirm = async () => {
        if (!userId || !businessId) {
            alert("User is not logged in or business ID is missing.");
            return;
        }

        const saleItems = addedProducts.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
        }));

        const response = await createSales(userId, businessId, saleItems);

        if (response.success) {
            await AsyncStorage.removeItem("addedProducts");
            alert("Sale completed successfully!");
            router.push('/main/sales');
        } else {
            alert("Error creating sale: " + (response.error || "Unknown error"));
        }
    };

    const totalPrice = addedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalQuantity = addedProducts.reduce((sum, p) => sum + p.quantity, 0);

    const renderRightActions = (index) => (
        <TouchableOpacity
            onPress={() => handleDelete(index)}
            style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 8, padding: 8, marginBottom: 16 }}
        >
            <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
    );

    return (
        <View className="p-5">
            <Text className="text-[#3C80B4] text-[20px] font-bold text-center pb-5">Added Products</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} style={{ height: '70%' }} keyboardShouldPersistTaps="handled">
                {addedProducts.length === 0 ? (
                    <Text>No products added yet</Text>
                ) : (
                    addedProducts.map((product, index) => (
                        <Swipeable key={index} renderRightActions={() => renderRightActions(index)} shouldCancelWhenOutside={true}>
                            <View className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center">
                                <Text className="text-xl font-bold mr-4">{index + 1}</Text>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold">{product.productName}</Text>
                                    <Text className="text-base text-blue-500">Price: Php {product.price}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity onPress={() => updateQuantity(index, -1)} className="bg-gray-200 p-2 rounded-md mx-2">
                                        <Text className="text-lg font-bold">-</Text>
                                    </TouchableOpacity>
                                    <Text className="text-lg font-bold">{product.quantity}</Text>
                                    <TouchableOpacity onPress={() => updateQuantity(index, 1)} className="bg-gray-200 p-2 rounded-md mx-2">
                                        <Text className="text-lg font-bold">+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Swipeable>
                    ))
                )}
            </ScrollView>

            <View className="flex-row justify-between w-full mt-5 border-t border-b border-gray-300">
                <View className="flex-col w-[40%] items-center">
                    <Text className="text-xl font-semibold">Total</Text>
                    <Text className="text-2xl font-bold">Php {totalPrice.toFixed(2)}</Text>
                </View>
                <View className="flex-col w-[40%] items-center">
                    <Text className="text-lg">QTY</Text>
                    <Text className="text-xl font-medium">{totalQuantity}</Text>
                </View>
            </View>

            <View className="flex-row justify-between w-full mt-6">
                <TouchableOpacity onPress={handleCancel} className="bg-red-500 p-4 rounded-full flex-1 mr-2">
                    <Text className="text-white font-bold text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} className="bg-blue-500 p-4 rounded-full flex-1 ml-2">
                    <Text className="text-white font-bold text-center">Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddedProductComponent;
