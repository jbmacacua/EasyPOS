import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@components/header";
import InventoryItem from "@components/inventory/inventoryItem";
import BarcodeScanner from "./barcodeScanner";

import { getProducts } from "@api/inventory";
import { useSession } from "@context/auth";

const Inventory = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [isAscending, setIsAscending] = useState(true);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      if (!parsedSession?.user?.id || !businessId) return;

      const { data: products, success, error } = await getProducts(
        parsedSession.user.id,
        businessId,
        1, // Page number
        100, // Items per page
        selectedFilter || "name",
        isAscending ? "asc" : "desc",
        searchQuery
      );


      if (!success) {
        console.error("Error fetching products:", error);
        return;
      }

      setData(products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [parsedSession, businessId, selectedFilter, isAscending, searchQuery])
  );

  const handleDelete = async (id) => {
    // You can implement this with Supabase if you want to actually delete it remotely
    console.warn("Delete feature is not implemented for Supabase data.");
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
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
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={loadProducts}
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
          renderItem={({ item, index  }) => <InventoryItem item={item} onDelete={handleDelete}  index={index + 1}/>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />   


        {/* Barcode Scanner Button */}
        {userRole !== 'sales' && <BarcodeScanner userId={parsedSession?.user?.id}
    businessId={businessId}/>}
      </View>
    </View>
  );
};

export default Inventory;
