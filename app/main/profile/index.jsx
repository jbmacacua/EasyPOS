import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from 'react';
import Header from "@components/header";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
        <View className="flex-1">
          {/* Profile Info */}
          <View>
            <View className="flex-row items-center space-x-4 mb-6">
              <View className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center ml-5 mt-5">
                <Feather name="user" size={32} color="black" />
              </View>
              <View className="ml-8">
                <Text className="text-lg font-semibold">Bermuda ni Bermundo</Text>
                <Text className="text-gray-600">092134534</Text>
                <Text className="text-gray-600">jimel@email.com</Text>
              </View>
            </View>

            {/* Settings Options */}
            <View className="border-t border-gray-300 mt-4">
              <TouchableOpacity className="flex-row justify-between items-center py-4 border-b border-gray-300" onPress={() => router.push("/main/profile/accountSettings")}>
                <Text className="text-base text-black">Account Settings</Text>
                <Feather name="chevron-right" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row justify-between items-center py-4" onPress={() => router.push("/main/profile/changePassword")}>
                <Text className="text-base text-black">Change Password</Text>
                <Feather name="chevron-right" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-auto">
            <TouchableOpacity className="bg-[#007DA5] py-3 rounded-xl" onpPress={() => router.push("/auth/login")}>
              <Text className="text-white text-center font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </View>
  );
};

export default Profile;
