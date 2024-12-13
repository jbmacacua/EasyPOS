import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@components/header";

const Inventory = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [data, setData] = useState(
    Array.from({ length: 5 }).map((_, index) => ({
      id: index + 1,
      name: `Product Name ${index + 1}`,
      stockLeft: 12345 - index * 1000, // Adjusted stockLeft values for clarity
      barcode: 67890,
      price: 20.0,
      date: "2022-10-28",
    }))
  );

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setShowDropdown(false);

    let sortedData = [...data];
    if (filter === "name") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filter === "date") {
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filter === "quantity") {
      sortedData.sort((a, b) => a.stockLeft - b.stockLeft);
    }

    if (!isAscending) {
      sortedData.reverse();
    }

    setData(sortedData);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
    setData([...data].reverse());
  };

  const renderItem = ({ item }) => (
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

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-6">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">Inventory</Text>

        <View>
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="flex-1 bg-gray-100 rounded-full px-3 py-2 flex-row items-center space-x-2">
              <Ionicons name="search" size={18} color="#666" />
              <TextInput
                placeholder="Search"
                className="flex-1 text-gray-700"
                placeholderTextColor="#999"
              />
            </View>
            <View className="w-3" />
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full" onPress={() => setShowDropdown(!showDropdown)}>
              <Ionicons name="filter" size={24} color="#666" />
            </TouchableOpacity>
            {showDropdown && (
              <View className="absolute top-12 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-36">
                <TouchableOpacity
                  className={`p-2 ${selectedFilter === "name" ? "bg-blue-100" : ""}`}
                  onPress={() => handleFilter("name")}
                >
                  <Text className="text-gray-700">Name</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2 ${selectedFilter === "date" ? "bg-blue-100" : ""}`}
                  onPress={() => handleFilter("date")}
                >
                  <Text className="text-gray-700">Date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2 ${selectedFilter === "quantity" ? "bg-blue-100" : ""}`}
                  onPress={() => handleFilter("quantity")}
                >
                  <Text className="text-gray-700">Quantity</Text>
                </TouchableOpacity>
              </View>
            )}
            <View className="w-3" />
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full" onPress={toggleSortOrder}>
              <Ionicons name="swap-vertical" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Barcode Scanner Button */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-[#3F89C1] p-4 rounded-full shadow-lg"
          onPress={() => console.log("Barcode scanner activated")}
        >
          <Ionicons name="barcode" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Inventory;