import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "@components/header";
import AddedProductComponent from "@components/employeeSales/addedProductComponent";

export default function AddedProducts() {

  return (
    <View className="bg-[#3F89C1] flex-1">
      {/* Header */}
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <AddedProductComponent />
      </View>
    </View>
  );
}
