import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

export default function BusinessInformation() {
  // States to store input values
  const [storeName, setStoreName] = useState("EasyPOS Store");
  const [contactNumber, setContactNumber] = useState("+123 456 7890");
  const [email, setEmail] = useState("contact@easypos.com");
  const [address, setAddress] = useState("1234 Main St, City, Country");

  return (
    <View className="pr-5 pl-5">

      {/* Store Name */}
      <View className="mb-5">
        <Text className="text-black text-[16px] py-2 font-medium">Store Name:</Text>
        <TextInput
          value={storeName}
          onChangeText={setStoreName}
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
          className="bg-gray-100 p-4 rounded-lg text-black text-[16px]"
        />
      </View>
    </View>
  );
}
