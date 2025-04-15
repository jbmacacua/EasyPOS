import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from 'react';
import Header from "@components/header";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from "@context/auth";
import { getUserDetails } from "../../../api/accounts";

const Profile = () => {
  const router = useRouter();
  const { session } = useSession();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = parsedSession?.user?.id;

      if (userId) {
        const res = await getUserDetails(userId);
        if (res.success) {
          setUserDetails(res.userDetails);
        } else {
          console.error("Error fetching user details:", res.error);
        }
        setLoading(false); // Set loading to false after data fetch is complete
      }
    };

    fetchUserDetails();
  }, [parsedSession]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007DA5" />
      </View>
    );
  }

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
        <View className="flex-1">
          {/* Profile Info */}
          <View>
            <View className="flex-row items-center space-x-4 mb-6">
              
            {userDetails?.profile_image ? (
                  <Image
                      source={{ uri: userDetails.profile_image }}
                      className="w-20 h-20 rounded-full"
                      resizeMode="cover"
                  />
              ) : (
                  <View className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center">
                      <Feather name="user" size={32} color="black" />
                  </View>
              )}
              <View className="ml-8">
                <Text className="text-lg font-semibold">{userDetails?.first_name + " " +  userDetails?.last_name || "No Name"}</Text>
                <Text className="text-gray-600">{userDetails?.contact_number || "No Number"}</Text>
                <Text className="text-gray-600">{userDetails?.address || "No Address"}</Text>
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

          {/* Logout Button */}
          <View className="mt-auto">
            <TouchableOpacity className="bg-[#007DA5] py-3 rounded-xl" onPress={handleLogout}>
              <Text className="text-white text-center font-semibold text-lg">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;
