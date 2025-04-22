import React, { useState } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const InventoryItem = ({ item, onDelete, index }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const goToDetails = () => {
    router.push({
      pathname: "/main/inventory/[id]",
      params: {
        id: item.id,
        name: item.name,
        barCode: item.bar_code,
        price: item.price,
        stockLeft: item.quantity,
        imageUrl: item.image_file,
      },
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item.id), // Call the onDelete function passed from parent
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <TouchableOpacity
        onPress={goToDetails}
        className="flex-row items-start border border-gray-200 p-4 my-2 rounded-lg bg-white relative"
      >
        <Text className="text-lg font-bold text-gray-700 p-5">{index}.</Text>

        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>

          <View className="flex-row justify-between mt-1">
            <View className="flex-1 pr-2">
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Stock Number:</Text>{" "}
                {item.total_quantity_since_restock ?? "N/A"}
              </Text>
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Barcode:</Text>{" "}
                {item.bar_code || "Not scanned"}
              </Text>
            </View>

            <View className="flex-1 pl-2">
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Price (PHP):</Text>{" "}
                {item.price ? parseFloat(item.price).toFixed(2) : "0.00"}
              </Text>
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Stock Left:</Text>{" "}
                {item.quantity ?? "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* 3-dot menu */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} className="ml-3">
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View className="absolute right-4 top-10 bg-white border border-gray-300 rounded-md shadow-md w-32 z-20">
<TouchableOpacity
  onPress={() => {
    setMenuVisible(false);
    router.push({
      pathname: `/main/inventory/${item.id}/edit`,
      params: {
        id: item.id,
        name: item.name,
        barCode: item.bar_code,
        price: item.price,
        stockLeft: item.quantity,
        imageUrl: item.image_file,
      },
    });
  }}
  className="p-2"
>
  <Text className="text-blue-600 font-semibold">Edit</Text>
</TouchableOpacity>


            <TouchableOpacity
              onPress={handleDelete} // Trigger delete action
              className="p-2"
            >
              <Text className="text-red-600 font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

export default InventoryItem;
