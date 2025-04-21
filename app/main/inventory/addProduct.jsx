import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '@components/header';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadProductImage, addProduct } from '@api/inventory';
import { useSession } from '@context/auth';
import ProductDetails from '@components/inventory/productDetails'; 

export default function AddProduct() {
    const router = useRouter();
    const { session, businessId } = useSession();
    const { barcode } = useLocalSearchParams();  
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null); 
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stockLeft, setStockLeft] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const userId = session ? JSON.parse(session)?.user?.id : null;

    useEffect(() => {
        if (barcode) {
          setProductName('');
          setPrice('');
          setStockLeft('');
          setImageUrl(null); 
        }
      }, [barcode]);

    const pickImage = async () => {
        console.log("Opening image picker...");
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });
    
        console.log("Image Picker result:", result);
    
        if (result?.assets?.length > 0) {
            const asset = result.assets[0];
            setImage(asset.uri);
            setImageBase64(asset.base64);
        } else {
            console.log("No image selected or picker was cancelled.");
        }
    };

    const saveProduct = async () => {
        if (!productName || !price || !stockLeft || !barcode || !userId || !businessId) {
            console.log('Missing fields:', { productName, price, stockLeft, barcode, userId, businessId });
            return;
        }

        try {
            const { success: productAdded, productId, error: productError } = await addProduct(
                userId,
                barcode,  
                businessId,
                productName,
                parseFloat(price),
                parseFloat(price),
                parseInt(stockLeft, 10),
                parseInt(stockLeft, 10)
            );

            console.log("Product ID from addProduct:", productId);

            if (!productAdded) throw new Error(productError);

            // Now upload the image, using the productId as reference
            if (image && imageBase64) {
                const { success, url, error } = await uploadProductImage(
                    { base64: imageBase64, type: 'image/jpeg' },
                    userId,
                    businessId,
                    productId  
                );
                console.log("🧪 uploadProductImage result:", { success, url, error });

                if (!success) throw new Error(error);
                setImageUrl(url);
            }

            setIsSaved(true);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    // Function to handle editing the product
    const handleEdit = () => {
        setIsSaved(false);
        // Reset the form or make other necessary adjustments here
    };

    return (
        <View className="bg-[#3F89C1] flex-1">
            <Header />
            <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
                <TouchableOpacity
                    onPress={() => router.push('/main/inventory/')}
                    className="absolute top-4 right-4 p-2 z-10 mr-3"
                >
                    <Ionicons name="close" size={32} color="black" />
                </TouchableOpacity>

                {isSaved ? (
                    <ProductDetails
                        product={{ productName, barcode, price, stockLeft, imageUrl }}
                        onEdit={handleEdit}
                    />
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

                        <Text className="text-lg font-semibold mt-4 mb-1">Scanned Barcode:</Text>
                        <TextInput
                            className="bg-gray-100 p-4 rounded-lg mb-4"
                            placeholder="Scanned Barcode"
                            value={barcode}  
                            editable={false} 
                        />

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