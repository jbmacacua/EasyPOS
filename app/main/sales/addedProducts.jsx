import React, {useEffect} from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import Header from "@ui/header";
import AddedProductComponent from "@sales/addedProductComponent";

export default function AddedProducts() {
  const { items } = useLocalSearchParams(); // Get query param
  const parsedItems = items ? JSON.parse(items) : []; // Parse string

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-[#3F89C1] flex-1">
        <Header />
        <View className="bg-white rounded-t-[65px] flex-1">
          <AddedProductComponent items={parsedItems} /> 
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
