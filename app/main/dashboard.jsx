import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "@components/header";
import SalesCalculation from "@components/salesCalculation";
import IncomeCalculation from "@components/incomeCalculation";
import MostSoldItems from "@components/mostSoldItems";
import RestockItems from "@components/restockItems";
import Tabs from "@components/tabs"; // Import the Tabs component

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Daily"); // State to track the active tab

  return (
    <View className="bg-[#3F89C1] flex-1">
      {/* Header */}
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">Dashboard</Text>
        
        {/* Tabs Component */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={{ padding: 8 }}>
          {/* Sales Calculation */}
          <View className="mb-3 w-[95%] mx-auto">
            <SalesCalculation activeTab={activeTab} />
          </View>

          {/* Income Calculation */}
          <View className="mb-3 w-[95%] mx-auto">
            <IncomeCalculation activeTab={activeTab} />
          </View>

          {/* Most Sold Items */}
          <View className="mb-3 w-[95%] mx-auto">
            <MostSoldItems activeTab={activeTab} />
          </View>

          {/* Restock Items */}
          <View className="mb-3 w-[95%] mx-auto">
            <RestockItems />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
