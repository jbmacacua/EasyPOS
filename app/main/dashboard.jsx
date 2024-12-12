import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Header from "../../components/header";
import SalesCalculation from "../../components/salesCalculation";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Daily"); // State to track the active tab

  return (
    <View className="bg-[#3F89C1] flex-1">
      {/* Header */}
      <Header />

      <View className="bg-white rounded-t-[65px] p-8 flex-1">
        {/* Tabs: Daily, Weekly, Monthly */}
        <View className="flex-row justify-center mb-4">
          {/* Daily Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 shadow-md ${activeTab === "Daily" ? "bg-[#3B82F6]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Daily")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Daily" ? "text-white" : "text-[#3B82F6]"
                }`}
            >
              Daily
            </Text>
          </TouchableOpacity>

          {/* Weekly Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 ${activeTab === "Weekly" ? "bg-[#3B82F6]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Weekly")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Weekly" ? "text-white" : "text-[#3B82F6]"
                }`}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          {/* Monthly Tab */}
          <TouchableOpacity
            className={`px-5 py-2 w-[90px] rounded-full mx-2 ${activeTab === "Monthly" ? "bg-[#3B82F6]" : "bg-white border border-[#1C547E]"
              }`}
            onPress={() => setActiveTab("Monthly")}
          >
            <Text
              className={`font-bold text-center ${activeTab === "Monthly" ? "text-white" : "text-[#3B82F6]"
                }`}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <SalesCalculation />
        </View>
      </View>
    </View>
  );
}
