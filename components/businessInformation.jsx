import React, { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity } from "react-native";

export default function BusinessInformation({ isModalVisible, setModalVisible }) {
  const [storeName, setStoreName] = useState("EasyPOS Store");
  const [contactNumber, setContactNumber] = useState("+123 456 7890");
  const [email, setEmail] = useState("contact@easypos.com");
  const [address, setAddress] = useState("1234 Main St, City, Country");

  // Temp states for modal edits
  const [tempStoreName, setTempStoreName] = useState(storeName);
  const [tempContact, setTempContact] = useState(contactNumber);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempAddress, setTempAddress] = useState(address);

  const handleSave = () => {
    setStoreName(tempStoreName);
    setContactNumber(tempContact);
    setEmail(tempEmail);
    setAddress(tempAddress);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempStoreName(storeName);
    setTempContact(contactNumber);
    setTempEmail(email);
    setTempAddress(address);
    setModalVisible(false);
  };

  return (
    <View className="pr-5 pl-5">
      {/* Displayed info */}
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Store Name:</Text>
        <Text className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg">{storeName}</Text>
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Contact Number:</Text>
        <Text className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg">{contactNumber}</Text>
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Email:</Text>
        <Text className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg">{email}</Text>
      </View>
      <View className="mb-4">
        <Text className="text-black text-[16px] py-2">Address:</Text>
        <Text className="text-[16px] font-medium p-4 bg-gray-100 rounded-lg">{address}</Text>
      </View>

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black p-5">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-4">Edit Business Information</Text>

            {/* Store Name */}
            <Text className="text-black font-medium mb-1">Store Name</Text>
            <TextInput
              value={tempStoreName}
              onChangeText={setTempStoreName}
              className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              placeholder="Enter store name"
            />

            {/* Contact Number */}
            <Text className="text-black font-medium mb-1">Contact Number</Text>
            <TextInput
              value={tempContact}
              onChangeText={setTempContact}
              keyboardType="phone-pad"
              className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              placeholder="Enter contact number"
            />

            {/* Email */}
            <Text className="text-black font-medium mb-1">Email</Text>
            <TextInput
              value={tempEmail}
              onChangeText={setTempEmail}
              keyboardType="email-address"
              className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              placeholder="Enter email"
            />

            {/* Address */}
            <Text className="text-black font-medium mb-1">Address</Text>
            <TextInput
              value={tempAddress}
              onChangeText={setTempAddress}
              multiline
              className="bg-gray-100 p-4 rounded-lg mb-4 text-black"
              placeholder="Enter address"
            />

            {/* Action buttons */}
            <View className="flex-row justify-end space-x-3 gap-4">
              <TouchableOpacity
                onPress={handleCancel}
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
          </View>
        </View>
      </Modal>
    </View>
  );
}
