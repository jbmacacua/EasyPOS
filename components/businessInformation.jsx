import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSession } from "@context/auth";
import {
  getBusinessDetails,
  editBusinessInformation,
} from "../api/business";
import { useNavigation } from "expo-router";

export default function BusinessInformation({ editMode }) {
  const { session, businessId, userRole } = useSession();
  const navigation = useNavigation();

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!parsedSession) {
      navigation.replace("/");
    }
  }, [parsedSession]);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const { success, businessDetails, error } = await getBusinessDetails(
        userId,
        businessId
      );
      if (success && businessDetails) {
        setStoreName(businessDetails.store_name || "");
        setContactNumber(businessDetails.contact_number || "");
        setEmail(businessDetails.email_address || "");
        setAddress(businessDetails.address || "");
      } else {
        Alert.alert("Error", error?.message || "Failed to fetch business details");
      }
      setLoading(false);
    }

    if (userId && businessId) {
      fetchDetails();
    }
  }, [userId, businessId]);

  const handleSave = async () => {
    setSaving(true);
    const { success, error } = await editBusinessInformation(
      storeName,
      contactNumber,
      email,
      address,
      userId,
      businessId
    );

    if (success) {
      Alert.alert("Success", "Business information updated!");
    } else {
      Alert.alert("Error", error?.message || "Failed to update business info");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="text-black mt-4">Loading business information...</Text>
      </View>
    );
  }

  return (
    <View className="pr-5 pl-5 mt-4">
      {/* Store Name */}
      <View className="mb-5">
        <Text className="text-black text-[16px] py-2 font-medium">Store Name:</Text>
        <TextInput
          value={storeName}
          onChangeText={setStoreName}
          editable={editMode}
          className="bg-gray-100 p-4 rounded-lg text-black text-[16px]"
        />
      </View>

      {/* Contact Number */}
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2 font-medium">Contact Number:</Text>
        <TextInput
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          editable={editMode}
          className="bg-gray-100 p-4 rounded-lg text-black text-[16px]"
        />
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2 font-medium">Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={editMode}
          className="bg-gray-100 p-4 rounded-lg text-black text-[16px]"
        />
      </View>

      {/* Address */}
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2 font-medium">Address:</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={4}
          editable={editMode}
          className="bg-gray-100 p-4 rounded-lg text-black text-[16px]"
        />
      </View>

      {/* Save Button */}
      {editMode && (
        <Button
          title={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={saving}
        />
      )}
    </View>
  );
}
