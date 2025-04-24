import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { useSession } from "@context/auth"; // <-- useSession instead of useAuth

const Tabs = ({ activeTab, setActiveTab }) => {
    const { userRole } = useSession(); // <-- useSession hook here
    const screenWidth = Dimensions.get('window').width;
    const tabWidth = screenWidth / 3; // Adjust the width of each tab based on screen size

  const tabs = userRole === 'sales' ? ['Daily'] : ['Daily', 'Weekly', 'Monthly'];

  return (
    <View className="flex-row justify-center mb-4">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={{
            width: tabWidth - (tabWidth * 0.3),
          }}
          className={`px-5 py-2 rounded-full mx-2 shadow-md ${activeTab === tab ? "bg-[#3C80B4]" : "bg-white border border-[#1C547E]"}`}
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
