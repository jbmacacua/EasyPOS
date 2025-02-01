import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Header from "@components/header";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router"; // Import router

export default function AddProduct() {
    const router = useRouter(); // Initialize router
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stockLeft, setStockLeft] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    // Pick Image from Gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="bg-[#3F89C1] flex-1">
            {/* Header */}
            <Header />
            <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
                <TouchableOpacity
                    onPress={() => router.push("/main/inventory/")}
                    className="absolute top-4 right-4 p-2 z-10 mr-3">
                    <Ionicons name="close" size={32} color="black" />
                </TouchableOpacity>
                {isSaved ? (
                    // Display Product Details After Save
                    <View className="items-start w-full">
                        {/* Centered Image */}
                        <View className="w-full items-center my-4">
                            {image && <Image source={{ uri: image }} className="w-48 h-48 rounded-lg" />}
                        </View>

                        <View className="ml-2 self-start">
                            <Text className="text-2xl font-bold mb-4">{productName || 'Product Name'}</Text>
                            <Text className="text-lg mb-2">
                                Bar Code No : <Text className="font-bold">67890</Text>
                            </Text>
                            <Text className="text-lg mb-2">
                                Price : <Text className="font-bold">Php {price || '0'}</Text>
                            </Text>
                            <Text className="text-lg">
                                Stocks Left: <Text className="font-bold">{stockLeft || '0'}</Text>
                            </Text>
                        </View>

                        <TouchableOpacity
                            className="bg-[#007DA5] py-3 rounded-2xl w-full self-center mt-16"
                            onPress={() => setIsSaved(false)}
                        >
                            <Text className="text-white text-center font-semibold text-lg">Edit details</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Input Form Before Save
                    <>
                        <TouchableOpacity className="self-center mb-6" onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} className="w-24 h-24 rounded-lg" />
                            ) : (
                                <View className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-200">
                                    <Ionicons name="camera" size={40} color="gray" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold mb-1">Product Name:</Text>
                        <TextInput
                            className="bg-gray-100 p-4 rounded-lg mb-4"
                            placeholder="Product Name"
                            value={productName}
                            onChangeText={setProductName}
                        />

                        <View className="flex-row justify-between">
                            <View className="w-[48%]">
                                <Text className="text-lg font-semibold mb-1">Price:</Text>
                                <TextInput
                                    className="bg-gray-100 p-4 rounded-lg"
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-lg font-semibold mb-1">Stock Left:</Text>
                                <TextInput
                                    className="bg-gray-100 p-4 rounded-lg"
                                    placeholder="Stock Left"
                                    keyboardType="numeric"
                                    value={stockLeft}
                                    onChangeText={setStockLeft}
                                />
                            </View>
                        </View>

                        <View className="mt-auto">
                            <TouchableOpacity
                                className="bg-[#007DA5] py-3 rounded-2xl"
                                onPress={() => setIsSaved(true)}
                            >
                                <Text className="text-white text-center font-semibold text-lg">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
