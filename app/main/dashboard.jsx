import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Header from "@components/header";
import SalesCalculation from "@components/salesCalculation";
import IncomeCalculation from "@components/incomeCalculation";
import MostSoldItems from "@components/mostSoldItems";
import RestockItems from "@components/restockItems";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Daily"); // State to track the active tab

  return (
    <View className="bg-[#3F89C1] flex-1">
      {/* Header */}
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">Dashboard</Text>
        {/* Tabs: Daily, Weekly, Monthly */}
        <View className="flex-row justify-center mb-4">
          {/* Daily Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 shadow-md ${activeTab === "Daily" ? "bg-[#3C80B4]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Daily")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Daily" ? "text-white" : "text-black"
                }`}
            >
              Daily
            </Text>
          </TouchableOpacity>

          {/* Weekly Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 ${activeTab === "Weekly" ? "bg-[#3C80B4]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Weekly")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Weekly" ? "text-white" : "text-black"
                }`}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          {/* Monthly Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 ${activeTab === "Monthly" ? "bg-[#3C80B4]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Monthly")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Monthly" ? "text-white" : "text-black"
                }`}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>


        {/* Scrollable content */}
        <ScrollView  contentContainerStyle={{ padding: 8 }}>
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
