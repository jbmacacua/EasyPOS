import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@components/header";
import InventoryItem from "@components/inventory/inventoryItem";
import BarcodeScanner from "./barcodeScanner";

import { getProducts } from "../../../services/api/inventory";

import { useSession } from "@context/auth";

const Inventory = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [data, setData] = useState([]);
  const { session, userRole, businessId } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  useEffect(() => {
    if (!parsedSession) {
      navigation.replace("/");
    }
  }, [parsedSession]);


  const loadProducts = async () => {
    try {
      let storedProducts = await AsyncStorage.getItem("products");
      let products = storedProducts ? JSON.parse(storedProducts) : [];
  
      // Define dummy data to be added
      const dummyData = [
          { id: 1, productName: "Instant Noodles (Lucky Me)", price: 30, quantity: 10 },
          { id: 2, productName: "Sachet Coffee (Nescafe 3-in-1)", price: 15, quantity: 20 },
          { id: 3, productName: "Sachet Shampoo (Pantene)", price: 25, quantity: 15 },
          { id: 4, productName: "Canned Tuna (555 Tuna)", price: 50, quantity: 5 },
          { id: 5, productName: "Canned Sardines (Mega)", price: 40, quantity: 7 },
          { id: 6, productName: "Pack of Salt (Martha's)", price: 20, quantity: 30 },
          { id: 7, productName: "Pack of Rice (NFA)", price: 150, quantity: 25 },
          { id: 8, productName: "5L Cooking Oil (Minola)", price: 350, quantity: 8 },
          { id: 9, productName: "Laundry Detergent (Surf)", price: 100, quantity: 10 },
      ];
  
      // Add the dummy data to the existing products
      products = [...products, ...dummyData];
  
      // Reassign IDs to ensure they are sequential (1, 2, 3, ...)
      products = products.map((p, index) => ({ ...p, id: index + 1 }));
  
      setData(products);
    } catch (error) {
        console.error("Error adding products:", error);
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
        {userRole !== 'sales' && <BarcodeScanner />}
      </View>
    </View>
  );
};

export default Inventory;
