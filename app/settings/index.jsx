import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SettingsHeader from "@components/settingsHeader";
import BusinessInformation from "@components/businessInformation";
import EmployeesAccount from "@components/employeesAccount";
import AboutUs from "@components/aboutUs";

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleBack = () => {
    if (selectedSection) {
      setSelectedSection(null);
    } else {
      navigation.goBack();
    }
  };

  const handleEditPress = () => {
    setModalVisible(true);
  };

  const handleAddPress = () => {
    setAddModalVisible(true);
  };

  const editButton = selectedSection === "employees"
    ? "add"
    : selectedSection === "about"
      ? "none"
      : selectedSection
        ? "edit"
        : null;

  return (
    <View className="bg-[#3F89C1] flex-1">
      <SettingsHeader editButton={editButton} backButton={handleBack} onEdit={handleEditPress} onAdd={handleAddPress} />

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
          <BusinessInformation isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
        )}
        {selectedSection === "employees" && (
          <EmployeesAccount isAddModalVisible={isAddModalVisible} setAddModalVisible={setAddModalVisible} />
          )}
        {selectedSection === "about" && <AboutUs />}

        {!selectedSection && (
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            {[
              { label: "Business Information", key: "business" },
              { label: "Employees Account", key: "employees" },
              { label: "About Us", key: "about" },
            ].map(({ label, key }) => (
              <TouchableOpacity
                key={key}
                className="bg-white p-3 mb-4 border-b border-[#3C80B4] rounded-lg flex-row items-center justify-between"
                onPress={() => setSelectedSection(key)}
              >
                <Text className="text-black text-[18px] font-semibold">{label}</Text>
                <Feather name="chevron-right" size={24} color="#3C80B4" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
