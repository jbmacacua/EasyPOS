import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "@components/header";
import Tabs from "@components/tabs"; // Import the Tabs component
import TotalIncome from "@components/totalIncome";
import SalesSummary from "@components/salesSummary";
import BarcodeScanner from "./saleBarcodeScanner";
import { useAuth } from '../../../context/authContext';

export default function Sales() {
  const [activeTab, setActiveTab] = useState("Daily"); // State to track the active tab
   const { userRole } = useAuth();

  return (
    <View className="bg-[#3F89C1] flex-1">
      {/* Header */}
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">Sales Summary</Text>
        
        {/* Tabs Component */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={{ padding: 8 }}>
          {/* Total Income */}
          <View className="mb-3 w-[95%] mx-auto">
            <TotalIncome activeTab={activeTab} />
          </View>
          <View className="mb-3 w-[95%] mx-auto">
            <SalesSummary activeTab={activeTab} />
          </View>
        </ScrollView>
        {userRole == 'employee' && <BarcodeScanner />}
      </View>
    </View>
  );
}
