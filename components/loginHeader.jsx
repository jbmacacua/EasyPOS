import React from "react";
import { View, Text } from "react-native";

export default function loginHeader() {
  return (
    <View className="bg-[#3C80B4] pb-5 relative overflow-hidden">
      {/* Blobs in the background */}
      <View className="absolute top-[50] left-0">
        <View className="bg-[#3F89C1] w-[150px] h-[150px] rounded-tr-full opacity-100"></View>
      </View>
      <View className="absolute top-5 right-[-100]">
        <View className="bg-[#3F89C1] w-[450px] h-[450px] rounded-t-full opacity-100"></View>
      </View>

      {/* Header Content */}
      <View className="flex-row items-center justify-between px-10 pt-5 z-10">
        {/* App Name */}
        <Text className="text-white text-[32px] font-bold">EasyPOS</Text>
      </View>
    </View>
  );
}
