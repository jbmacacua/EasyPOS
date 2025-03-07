import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@components/header";
import InventoryItem from "@components/inventory/inventoryItem";
import BarcodeScanner from "./barcodeScanner";
import { useAuth } from '../../../context/authContext';

const Inventory = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [data, setData] = useState([]);
  const { userRole } = useAuth();

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem("products");
      if (storedProducts) {
        setData(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleDelete = async (id) => {
    try {
      let storedProducts = await AsyncStorage.getItem("products");
      let products = storedProducts ? JSON.parse(storedProducts) : [];
  
      // Remove the item with the given id
      products = products.filter((p) => p.id !== id);
  
      // Reassign IDs to ensure they are sequential (1, 2, 3, ...)
      products = products.map((p, index) => ({ ...p, id: index + 1 }));
  
      await AsyncStorage.setItem("products", JSON.stringify(products));
      setData(products);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  


  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setShowDropdown(false);

    let sortedData = [...data];
    if (filter === "name") {
      sortedData.sort((a, b) => a.productName.localeCompare(b.productName));
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
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full mx-3" onPress={() => setShowDropdown(!showDropdown)}>
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
            <TouchableOpacity className="p-2 bg-gray-100 rounded-full" onPress={toggleSortOrder}>
              <Ionicons name="swap-vertical" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <InventoryItem item={item} onDelete={handleDelete} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />


        {/* Barcode Scanner Button */}
        {userRole !== 'employee' && <BarcodeScanner />}
      </View>
    </View>
  );
};

export default Inventory;
