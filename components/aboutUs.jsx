import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function AboutUs() {
  return (
    <ScrollView className="flex-1 bg-white">

      {/* Company Overview Section */}
      <View className="p-5 bg-[#f7f7f7] shadow-md rounded-lg my-5 mx-5">
        <Text className="text-[#3C80B4] text-[24px] font-semibold">Our Story</Text>
        <Text className="text-black text-[16px] mt-2">
          We are a passionate team committed to providing innovative solutions for your business. Our company,
          EasyPOS, has been at the forefront of simplifying the point-of-sale systems for small to medium-sized businesses.
        </Text>
      </View>

      {/* Team Section */}
      <View className="p-5 bg-[#f7f7f7] shadow-md rounded-lg my-5 mx-5">
        <Text className="text-[#3C80B4] text-[24px] font-semibold">Our Team</Text>
        <Text className="text-black text-[16px] mt-2">
          Our team is composed of talented professionals who believe in working together to achieve excellence. 
          From developers to customer support, we all share a common goal: your success.
        </Text>

        {/* Team Members */}
        <View className="flex-row mt-4 justify-between">
          {/* Member 1 */}
          <View className="flex-1 items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              className="w-[100px] h-[100px] rounded-full"
            />
            <Text className="mt-2 text-[#3C80B4] font-semibold">John Doe</Text>
            <Text className="text-[#7A7A7A]">CEO</Text>
          </View>

          {/* Member 2 */}
          <View className="flex-1 items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              className="w-[100px] h-[100px] rounded-full"
            />
            <Text className="mt-2 text-[#3C80B4] font-semibold">Jane Smith</Text>
            <Text className="text-[#7A7A7A]">CTO</Text>
          </View>

          {/* Member 3 */}
          <View className="flex-1 items-center">
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              className="w-[100px] h-[100px] rounded-full"
            />
            <Text className="mt-2 text-[#3C80B4] font-semibold">Tom Brown</Text>
            <Text className="text-[#7A7A7A]">COO</Text>
          </View>
        </View>
      </View>

      {/* Our Mission Section */}
      <View className="p-5 bg-[#f7f7f7] shadow-md rounded-lg my-5 mx-5">
        <Text className="text-[#3C80B4] text-[24px] font-semibold">Our Mission</Text>
        <Text className="text-black text-[16px] mt-2">
          Our mission is to provide a seamless, user-friendly POS system that helps businesses streamline their operations, 
          reduce manual errors, and improve customer satisfaction. We believe that technology should make life easier, and 
          that's exactly what we aim to do.
        </Text>
      </View>

      {/* Contact Information Section */}
      <View className="p-5 bg-[#f7f7f7] shadow-md rounded-lg my-5 mx-5">
        <Text className="text-[#3C80B4] text-[24px] font-semibold">Get in Touch</Text>
        <Text className="text-black text-[16px] mt-2">
          We're always open to feedback and questions! Reach out to us anytime, and we'll be happy to assist you.
        </Text>

        <View className="flex-row items-center mt-4">
          <Feather name="phone" size={24} color="#3C80B4" />
          <Text className="ml-2 text-[#3C80B4]">+123 456 7890</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <Feather name="mail" size={24} color="#3C80B4" />
          <Text className="ml-2 text-[#3C80B4]">contact@easypos.com</Text>
        </View>
      </View>

      {/* Footer Section */}
      <View className="py-4 bg-[#3C80B4]">
        <Text className="text-white text-center text-[14px]">© 2025 EasyPOS. All Rights Reserved.</Text>
      </View>
    </ScrollView>
  );
}
