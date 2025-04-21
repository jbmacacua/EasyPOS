import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Daily", "Weekly", "Monthly"];

  return (
    <View className="flex-row justify-center mb-4">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          className={`px-5 py-2 w-[90px] rounded-full mx-2 shadow-md ${activeTab === tab ? "bg-[#3C80B4]" : "bg-white border border-[#1C547E]"}`}
          onPress={() => setActiveTab(tab)}
        >
          <Text className={`font-bold text-center ${activeTab === tab ? "text-white" : "text-black"}`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tabs;
