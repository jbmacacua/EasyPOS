import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import SettingsHeader from "@components/settingsHeader";
import { useSession } from "@context/auth";

// Section components
import BusinessInformation from "@components/businessInformation";
import EmployeesAccount from "@components/employeesAccount";
import AboutUs from "@components/aboutUs";

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigation = useNavigation();

  const { session, userRole } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  useEffect(() => {
    if (!parsedSession) {
      navigation.replace("/");
    } else if (userRole === "sales") {
      setSelectedSection("about");
    }
  }, [parsedSession, userRole]);

  const handleBack = () => {
    if (editMode) {
      setEditMode(false);
    }

    if (userRole === "sales") {
      navigation.goBack();
    } else {
      if (selectedSection) {
        setSelectedSection(null);
      } else {
        navigation.goBack();
      }
    }
  };

  const handleEditPress = () => {
    setEditMode((prev) => !prev);
  };

  const getEditButton = () => {
    if (selectedSection === "employees") {
      return { type: "add", onPress: () => {} }; // replace with actual add logic if needed
    } else if (selectedSection === "business") {
      return { type: "edit", onPress: handleEditPress };
    } else if (selectedSection === "about") {
      return null;
    }
    return null;
  };

  return (
    <View className="bg-[#3F89C1] flex-1">
      <SettingsHeader editButton={getEditButton()} backButton={handleBack} />

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

        {selectedSection === "business" && (
          <BusinessInformation editMode={editMode} />
        )}
        {selectedSection === "employees" && <EmployeesAccount />}
        {selectedSection === "about" && <AboutUs />}

        {!selectedSection && (
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => {
                setSelectedSection("business");
                setEditMode(false);
              }}
            >
              <Text className="text-black text-[18px] font-semibold">
                Business Information
              </Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => {
                setSelectedSection("employees");
                setEditMode(false);
              }}
            >
              <Text className="text-black text-[18px] font-semibold">
                Employees Account
              </Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
              onPress={() => {
                setSelectedSection("about");
                setEditMode(false);
              }}
            >
              <Text className="text-black text-[18px] font-semibold">
                About Us
              </Text>
              <Feather name="chevron-right" size={24} color="#3C80B4" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
