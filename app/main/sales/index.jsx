import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "@ui/header";
import Tabs from "@ui/tabs"; 
import TotalIncome from "@sales/totalIncome";
import SalesSummary from "@sales/salesSummary";
import BarcodeScanner from "./saleBarcodeScanner";
import { useSession } from "@context/auth"; // <-- useSession instead of useAuth

export default function Sales() {
  const [activeTab, setActiveTab] = useState("Daily");
  const { userRole } = useSession(); // <-- useSession hook here

  useEffect(() => {
    console.log("User Role:", userRole); // Debug log
  }, [userRole]);

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">
          Sales Summary
        </Text>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <ScrollView contentContainerStyle={{ padding: 8 }}>
          <View className="mb-3 w-[95%] mx-auto">
            <TotalIncome activeTab={activeTab} />
          </View>
          <View className="mb-3 w-[95%] mx-auto">
            <SalesSummary activeTab={activeTab} />
          </View>
        </ScrollView>
        {userRole == 'sales' && <BarcodeScanner />}
      </View>
    </View>
  );
}
