import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Header from "@ui/header";
import { useRouter, useFocusEffect } from "expo-router";
import { useSession } from "@context/auth";
import { getUserDetails } from "@api/accounts";

const Profile = () => {
  const router = useRouter();
  const { session, signOut } = useSession();

  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  const fetchUserDetails = useCallback(async () => {
    const userId = parsedSession?.user?.id;
    if (userId) {
      setLoadingDetails(true);
      const res = await getUserDetails(userId);
      if (res.success) {
        setUserDetails(res.userDetails);
      } else {
        console.error("Error fetching user details:", res.error);
      }
      setLoadingDetails(false);
    }
  }, [parsedSession]);

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [fetchUserDetails])
  );

  useEffect(() => {
    if (parsedSession?.user?.id && loadingDetails) {
      fetchUserDetails();
    }
  }, [parsedSession, fetchUserDetails, loadingDetails]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut();
      router.replace("/auth/login"); // Redirect to login screen
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
        <View className="flex-1">
          {/* Profile Info */}
          <View className="mb-6">
            {userDetails ? (
              <View className="flex-row items-center space-x-4">
                {userDetails.profile_image ? (
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
                  <Text className="text-lg font-semibold">
                    {userDetails.first_name + " " + userDetails.last_name || "No Name"}
                  </Text>
                  <Text className="text-gray-600">{userDetails.contact_number || "No Number"}</Text>
                  <Text className="text-gray-600">{userDetails.address || "No Address"}</Text>
                </View>
                {loadingDetails && (
                  <ActivityIndicator className="ml-4" size="small" color="#007DA5" />
                )}
              </View>
            ) : (
              <View className="flex-row items-center space-x-4">
                <View className="w-20 h-20 rounded-full justify-center items-center">
                  <ActivityIndicator size="large" color="#007DA5" />
                </View>
                <View>
                  <Text className="text-lg font-semibold">Loading...</Text>
                  <Text className="text-gray-600">Loading...</Text>
                  <Text className="text-gray-600">Loading...</Text>
                </View>
              </View>
            )}
          </View>

          {/* Settings Options */}
          <View className="border-t border-gray-300 mt-4">
            <TouchableOpacity
              className="flex-row justify-between items-center py-4 border-b border-gray-300"
              onPress={() => router.push("/main/profile/accountSettings")}
            >
              <Text className="text-base text-black">Account Settings</Text>
              <Feather name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-between items-center py-4"
              onPress={() => router.push("/main/profile/changePassword")}
            >
              <Text className="text-base text-black">Change Password</Text>
              <Feather name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mt-auto">
          <TouchableOpacity
            className="bg-[#007DA5] py-3 rounded-xl flex-row items-center justify-center"
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Logout</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
