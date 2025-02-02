import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AddedProductComponent = () => {
    const [addedProducts, setAddedProducts] = useState([]); 
     const router = useRouter();


    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Retrieve products from AsyncStorage
                const storedProducts = await AsyncStorage.getItem("addedProducts");
                if (storedProducts) {
                    setAddedProducts(JSON.parse(storedProducts)); // Set the state to the stored products
                }
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };

        loadProducts();
    }, []);

    const updateQuantity = (index, change) => {
        const updatedProducts = [...addedProducts];
        updatedProducts[index].quantity = Math.max(0, updatedProducts[index].quantity + change); // Prevent negative quantity
        setAddedProducts(updatedProducts);

        // Save updated products back to AsyncStorage
        AsyncStorage.setItem("addedProducts", JSON.stringify(updatedProducts));
    };

    const handleDelete = (index) => {
        const updatedProducts = addedProducts.filter((_, i) => i !== index); // Remove the product at the given index
        setAddedProducts(updatedProducts);

        // Save updated products back to AsyncStorage
        AsyncStorage.setItem("addedProducts", JSON.stringify(updatedProducts));
    };

    const handleConfirm = () => {
        // Handle the confirmation logic (e.g., finalizing the order, etc.)
        router.push('/main/sales');
    };

    const handleCancel = async () => {
        try {
            // Clear the AsyncStorage data
            await AsyncStorage.removeItem("addedProducts");
            
            // Update state to empty array
            setAddedProducts([]);
            
            console.log("All products removed");
        } catch (error) {
            console.error("Error clearing added products:", error);
        }
    };
    

    // Calculate total price and quantity
    const totalPrice = addedProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    const totalQuantity = addedProducts.reduce((total, product) => total + product.quantity, 0);

    // Swipeable delete action
    const renderRightActions = (index) => {
        return (
            <TouchableOpacity
                onPress={() => handleDelete(index)}
                style={{
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 16,
                }}
            >
                <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
        );
    };

    return (
        <View className="p-5">
            <Text className="text-[#3C80B4] text-[20px] font-bold text-center pb-5">Added Products</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ height: '70%' }}
                // Ensure scroll and swipeable gestures work together
                keyboardShouldPersistTaps="handled"
            >
                {addedProducts.length === 0 ? (
                    <Text>No products added yet</Text>
                ) : (
                    addedProducts.map((product, index) => (
                        <Swipeable
                            key={index}
                            renderRightActions={() => renderRightActions(index)}
                            shouldCancelWhenOutside={true} // Ensure swipe is canceled when outside the product
                        >
                            <View className="border border-gray-300 rounded-lg p-4 mb-4 flex-row items-center">
                                <Text className="text-xl font-bold mr-4">{index + 1}</Text>

                                <View className="flex-1">
                                    <Text className="text-lg font-bold">{product.name}</Text>
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
            {/* Display Total Price and Total Quantity */}
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

            {/* Cancel and Confirm Buttons */}
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
