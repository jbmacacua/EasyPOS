import { Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '@ui/header';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { uploadProductImage, addProduct } from '@api/inventory';
import { useSession } from '@context/auth';
import ProductDetails from './[id]';

export default function AddProduct() {
    const router = useRouter();
    const { session, businessId } = useSession();
    const { barcode } = useLocalSearchParams();

    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = session ? JSON.parse(session)?.user?.id : null;

    useEffect(() => {
        if (barcode) {
            setProductName('');
            setPrice('');
            setBasePrice('');
            setQuantity('');
            setImageUrl(null);
            setIsSaved(false);
            setImage(null);
            setImageBase64(null);
        }
    }, [barcode]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (result?.assets?.length > 0) {
            const asset = result.assets[0];
            setImage(asset.uri);
            setImageBase64(asset.base64);
        }
    };

    const saveProduct = async () => {
        if (!productName || !price || !basePrice || !quantity || !barcode || !userId || !businessId) {
            console.log('Missing fields:', { productName, price, basePrice, quantity, barcode, userId, businessId });
            return;
        }

        setLoading(true);
        try {
            const parsedPrice = parseFloat(price);
            const parsedBasePrice = parseFloat(basePrice);
            const parsedQuantity = parseInt(quantity, 10);

            const { success: productAdded, productId, error: productError } = await addProduct(
                userId,
                barcode,
                businessId,
                productName,
                parsedPrice,
                parsedBasePrice,
                parsedQuantity, // quantity
                parsedQuantity  // total_quantity_since_restock
            );

            if (!productAdded) throw new Error(productError);

            if (image && imageBase64) {
                const { success, url, error } = await uploadProductImage(
                    { base64: imageBase64, type: 'image/jpeg' },
                    userId,
                    businessId,
                    productId
                );

                if (!success) throw new Error(error);
                setImageUrl(url);
            }

            setIsSaved(true);
            router.push('/main/inventory');
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsSaved(false);
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
                        product={{ productName, barcode, price, quantity, basePrice, imageUrl }}
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
                                <Text className="text-lg font-semibold mb-1">Base Price:</Text>
                                <TextInput
                                    className="bg-gray-100 p-4 rounded-lg"
                                    placeholder="Base Price"
                                    keyboardType="numeric"
                                    value={basePrice}
                                    onChangeText={setBasePrice}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-lg font-semibold mb-1">Quantity:</Text>
                            <TextInput
                                className="bg-gray-100 p-4 rounded-lg"
                                placeholder="Quantity"
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>

                        <Text className="text-lg font-semibold mt-4 mb-1">Scanned Barcode:</Text>
                        <TextInput
                            className="bg-gray-100 p-4 rounded-lg mb-4"
                            placeholder="Scanned Barcode"
                            value={barcode}
                            editable={false}
                        />

                        <View className="mt-auto">
                            <TouchableOpacity
                                className="bg-[#007DA5] py-3 rounded-2xl"
                                onPress={saveProduct}
                                disabled={loading}
                            >
                                <Text className="text-white text-center font-semibold text-lg">
                                    {loading ? 'Saving...' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
