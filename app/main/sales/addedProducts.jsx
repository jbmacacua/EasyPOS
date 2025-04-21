import React from "react";
import { View, ScrollView } from "react-native";
import { GestureHandlerRootView} from "react-native-gesture-handler"; 
import Header from "@ui/header";
import AddedProductComponent from "@sales/addedProductComponent";

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
