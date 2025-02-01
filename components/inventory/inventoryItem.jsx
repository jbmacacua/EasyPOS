import React from "react";
import { View, Text } from "react-native";

const InventoryItem = ({ item }) => {
  return (
    <View className="flex-row items-center border border-gray-200 p-3 my-2">
      <Text className="text-lg font-bold text-gray-700">{item.id}.</Text>
      <View className="flex-1 ml-4">
        <Text className="text-base font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          Stock No: {item.stockLeft} | Php {item.price.toFixed(2)}
        </Text>
        <Text className="text-sm text-gray-500">
          Bar code No: {item.barcode}
        </Text>
      </View>
      <Text className="text-sm text-gray-400">{item.date}</Text>
    </View>
  );
};

export default InventoryItem;
