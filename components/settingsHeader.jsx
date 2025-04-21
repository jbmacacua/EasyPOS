import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SettingsHeader({ editButton, backButton, onEdit, onAdd }) {
  return (
    <View className="bg-[#3C80B4] pb-5 relative overflow-hidden">
      {/* Background blobs */}
      <View className="absolute top-[50] left-0">
        <View className="bg-[#3F89C1] w-[150px] h-[150px] rounded-tr-full" />
      </View>
      <View className="absolute top-5 right-[-100]">
        <View className="bg-[#3F89C1] w-[450px] h-[450px] rounded-t-full" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-6 z-10 relative">
        {backButton ? (
          <TouchableOpacity onPress={backButton}>
            <Feather name="arrow-left" size={34} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} />
        )}

        <Text className="text-white text-[32px] absolute right-[37%] top-5 font-bold text-center flex-1">
          EasyPOS
        </Text>
        {editButton === "edit" && (
          <TouchableOpacity onPress={onEdit}>
            <Feather name="edit-3" size={30} color="white" />
          </TouchableOpacity>
        )}
        {editButton === "add" && (
          <TouchableOpacity onPress={onAdd}>
            <Feather name="plus-circle" size={30} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 34 }} /> // Placeholder for spacing if no edit/add button
        )}
      </View>
    </View>
  );
}
