import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSession } from "@context/auth";
import { editBusinessInformation, getBusinessDetails } from "@api/business";

export default function BusinessInformation({ isEditing, setIsEditing }) {
  const { session, userRole, businessId } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  const [storeName, setStoreName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Fetch business details on mount
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      const response = await getBusinessDetails(userId, businessId);
      if (response.success) {
        const { businessDetails } = response;
        setStoreName(businessDetails.store_name);
        setContactNumber(businessDetails.contact_number);
        setEmail(businessDetails.email_address);
        setAddress(businessDetails.address);
      }
    };
    fetchBusinessDetails();
  }, [userId, businessId]);

  const handleSave = async () => {
    const response = await editBusinessInformation(
      storeName,
      contactNumber,
      email,
      address,
      userId,
      businessId
    );
    if (response.success) {
      setIsEditing(false); // Disable editing mode
    } else {
      // Handle error
      console.warn("Error saving business information:", response.error);
    }
  };

  return (
    <View className="pr-5 pl-5">
      {/* Displayed info */}
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Store Name:</Text>
        <TextInput
          value={storeName}
          onChangeText={setStoreName}
          editable={isEditing}
          className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg"
          placeholder="Enter store name"
        />
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Contact Number:</Text>
        <TextInput
          value={contactNumber}
          onChangeText={setContactNumber}
          editable={isEditing}
          keyboardType="phone-pad"
          className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg"
          placeholder="Enter contact number"
        />
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          keyboardType="email-address"
          className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg"
          placeholder="Enter email"
        />
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Address:</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          editable={isEditing}
          multiline
          className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg"
          placeholder="Enter address"
        />
      </View>

      {isEditing && (
        <View className="flex-row justify-end space-x-3 gap-4">
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            className="border border-gray-400 px-5 py-2 rounded-lg"
          >
            <Text className="text-gray-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#3C80B4] px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
