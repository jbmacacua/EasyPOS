import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSession } from "@context/auth"; // <- Use this instead of useAuth

export default function Header() {
  const navigation = useNavigation(); // Get navigation object
  const { userRole } = useSession(); // Get user role from global context

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

        {/* Conditionally render Settings Icon if user role is not 'sales' */}
        {userRole !== "sales" && (
          <TouchableOpacity onPress={() => navigation.navigate("settings")}>
            <Feather name="settings" size={34} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
