import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SettingsHeader({ editButton, backButton }) {
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
      <View className="flex-row items-center justify-between px-5 pt-6 z-10 relative">
        {/* Back Button (Top Left) */}
        {backButton ? (
          <TouchableOpacity onPress={backButton}>
            <Feather name="arrow-left" size={34} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} /> // Placeholder for spacing if no back button
        )}

        {/* App Name (Centered) */}
        <Text className="text-white text-[32px] absolute right-[37%] top-5 font-bold text-center flex-1">
          EasyPOS
        </Text>

        {/* Edit or Add Button */}
        {editButton ? (
          <TouchableOpacity onPress={editButton.onPress}>
            <Feather
              name={editButton.type === "add" ? "plus-circle" : "edit-3"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} /> // Placeholder for spacing if no edit/add button
        )}
      </View>
    </View>
  );
}
