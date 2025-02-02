import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InventoryItem = ({ item, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const dropdownRef = useRef(null); // Ref to the dropdown menu

  // Close the dropdown if clicked outside
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setMenuVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View className="flex-row items-center border border-gray-200 p-3 my-2 relative">
        <Text className="text-lg font-bold text-gray-700">{item.id}.</Text>
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900">{item.productName}</Text>

          <View className="flex-row justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Stock Number:</Text> {item.stockLeft}
              </Text>
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Bar code No:</Text> {item.barcode ? item.barcode : "Not scanned"}
              </Text>
            </View>
            <View className="flex-1 pl-2">
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Php:</Text> {parseFloat(item.price).toFixed(2)}
              </Text>
              <Text className="text-sm text-gray-500">
                <Text className="font-bold">Stock Left:</Text> {item.stockLeft}
              </Text>
            </View>
          </View>
        </View>

        {/* 3-dot menu */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} className="ml-4">
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View
            ref={dropdownRef}
            className="absolute right-0 bg-white border border-gray-300 rounded-lg shadow-md w-32 p-2 z-10"
            style={{ top: 30 }} // Adjust to appear below the 3-dot icon
          >
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                // Handle edit action here (e.g., navigate to edit screen)
                console.log("Edit Product:", item.id);
              }}
              className="py-2"
            >
              <Text className="text-blue-600 font-semibold">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                Alert.alert(
                  "Delete Product",
                  "Are you sure you want to delete this product?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
                  ]
                );
              }}
              className="py-2"
            >
              <Text className="text-red-600 font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Date */}
        <Text className="text-sm text-gray-400 absolute bottom-2 right-4">{item.date}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InventoryItem;
