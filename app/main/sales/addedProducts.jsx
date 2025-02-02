import React from "react";
import { View, ScrollView } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler"; // Import gesture handlers
import Header from "@components/header";
import AddedProductComponent from "@components/employeeSales/addedProductComponent";

export default function AddedProducts() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-[#3F89C1] flex-1">
        <Header />

        <View className="bg-white rounded-t-[65px] flex-1">
          <AddedProductComponent />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
