import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from "@components/header";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProduct() {
    const router = useRouter();
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stockLeft, setStockLeft] = useState('');
    const [barcode, setBarcode] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchLastScannedBarcode = async () => {
            try {
                const storedBarcodes = await AsyncStorage.getItem("scannedBarcodes");
                if (storedBarcodes) {
                    const barcodes = JSON.parse(storedBarcodes);
                    if (barcodes.length > 0) {
                        setBarcode(barcodes[barcodes.length - 1].barcode); 
                    }
                }
            } catch (error) {
                console.error("Error fetching barcode:", error);
            }
        };
        

        fetchLastScannedBarcode();
    }, []);

    const saveProduct = async () => {
        if (!productName || !price || !stockLeft || !barcode) return;
    
        const newProduct = {
            productName,
            price: parseFloat(price),
            stockLeft: parseInt(stockLeft, 10),
            barcode, 
            date: new Date().toISOString().split("T")[0],
            image,
        };
    
        try {
            const existingProducts = await AsyncStorage.getItem("products");
            const products = existingProducts ? JSON.parse(existingProducts) : [];
    
            // Calculate the next available ID
            const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
            const productWithId = { ...newProduct, id: nextId };
    
            products.push(productWithId);
    
            await AsyncStorage.setItem("products", JSON.stringify(products));
            setIsSaved(true);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };
    

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
            <Header />
            <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
                <TouchableOpacity onPress={() => router.push("/main/inventory/")} className="absolute top-4 right-4 p-2 z-10 mr-3">
                    <Ionicons name="close" size={32} color="black" />
                </TouchableOpacity>

                {isSaved ? (
                    <View className="items-start w-full">
                        <View className="w-full items-center my-4">
                            {image && <Image source={{ uri: image }} className="w-48 h-48 rounded-lg" />}
                        </View>
                        <View className="ml-2 self-start">
                            <Text className="text-2xl font-bold mb-4">{productName || 'Product Name'}</Text>
                            <Text className="text-lg mb-2">
                                Bar Code No: <Text className="font-bold">{barcode || 'N/A'}</Text>
                            </Text>
                            <Text className="text-lg mb-2">
                                Price: <Text className="font-bold">Php {price || '0'}</Text>
                            </Text>
                            <Text className="text-lg">
                                Stocks Left: <Text className="font-bold">{stockLeft || '0'}</Text>
                            </Text>
                        </View>

                        <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl w-full self-center mt-16" onPress={() => setIsSaved(false)}>
                            <Text className="text-white text-center font-semibold text-lg">Edit details</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
                        <TextInput className="bg-gray-100 p-4 rounded-lg mb-4" placeholder="Product Name" value={productName} onChangeText={setProductName} />

                        <View className="flex-row justify-between">
                            <View className="w-[48%]">
                                <Text className="text-lg font-semibold mb-1">Price:</Text>
                                <TextInput className="bg-gray-100 p-4 rounded-lg" placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} />
                            </View>
                            <View className="w-[48%]">
                                <Text className="text-lg font-semibold mb-1">Stock Left:</Text>
                                <TextInput className="bg-gray-100 p-4 rounded-lg" placeholder="Stock Left" keyboardType="numeric" value={stockLeft} onChangeText={setStockLeft} />
                            </View>
                        </View>

                        {/* Display Barcode */}
                        <Text className="text-lg font-semibold mt-4 mb-1">Scanned Barcode:</Text>
                        <Text className="bg-gray-100 p-4 rounded-lg">{barcode || "No barcode scanned"}</Text>

                        <View className="mt-auto">
                            <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl" onPress={saveProduct}>
                                <Text className="text-white text-center font-semibold text-lg">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
