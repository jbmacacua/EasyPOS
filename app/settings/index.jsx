import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import SettingsHeader from "@components/settingsHeader";

// Import section components
import BusinessInformation from "@components/businessInformation";
import EmployeesAccount from "@components/employeesAccount";
import AboutUs from "@components/aboutUs";

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState(null);
  const navigation = useNavigation();

  const handleBack = () => {
    if (selectedSection) {
      setSelectedSection(null);
    } else {
      navigation.goBack();
    }
  };

  // Determine which icon to show
  const editButton = selectedSection === "employees"
    ? "add"
    : selectedSection === "about"
      ? "none"
      : selectedSection
        ? "edit"
        : null;

  return (
    <View className="bg-[#3F89C1] flex-1">
      <SettingsHeader editButton={editButton} backButton={handleBack} />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">
          {selectedSection
            ? selectedSection === "business"
              ? "Business Information"
              : selectedSection === "employees"
                ? "Employees Account"
                : selectedSection === "about"
                  ? "About Us"
                  : ""
            : "Settings"}
        </Text>


        {/* Render the selected section or show the settings list */}
        {selectedSection === "business" && <BusinessInformation />}
        {selectedSection === "employees" && <EmployeesAccount />}
        {selectedSection === "about" && <AboutUs />}

        {!selectedSection && (
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => setSelectedSection("business")}
            >
              <Text className="text-black text-[18px] font-semibold">Business Information</Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => setSelectedSection("employees")}
            >
              <Text className="text-black text-[18px] font-semibold">Employees Account</Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => setSelectedSection("about")}
            >
              <Text className="text-black text-[18px] font-semibold">About Us</Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

