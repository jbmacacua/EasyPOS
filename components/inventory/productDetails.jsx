// ProductDetails.js
import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';

const ProductDetails = ({ product, onEdit }) => {
    const { productName, barCode, price, stockLeft, imageUrl } = product;

    return (
        <View className="items-start w-full">
            <View className="w-full items-center my-4">
                {imageUrl && <Image source={{ uri: imageUrl }} className="w-48 h-48 rounded-lg" />}
            </View>
            <View className="ml-2 self-start">
                <Text className="text-2xl font-bold mb-4">{productName || 'Product Name'}</Text>
                <Text className="text-lg mb-2">
                    Bar Code No: <Text className="font-bold">{barCode || 'N/A'}</Text>
                </Text>
                <Text className="text-lg mb-2">
                    Price: <Text className="font-bold">Php {price || '0'}</Text>
                </Text>
                <Text className="text-lg">
                    Stocks Left: <Text className="font-bold">{stockLeft || '0'}</Text>
                </Text>
            </View>

            <TouchableOpacity
                className="bg-[#007DA5] py-3 rounded-2xl w-full self-center mt-16"
                onPress={onEdit}
            >
                <Text className="text-white text-center font-semibold text-lg">Edit details</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProductDetails;