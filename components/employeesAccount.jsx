import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For the vertical 3 dots icon

const EmployeeItem = ({ employee, onEdit, onDelete, activeDropdown, setActiveDropdown }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setActiveDropdown(showDropdown ? null : employee.id); // Close dropdown if it's already open, else set active dropdown
  };

  useEffect(() => {
    if (activeDropdown !== employee.id) {
      setShowDropdown(false); // Close dropdown if it's not the active one
    }
  }, [activeDropdown, employee.id]);

  return (
    <View className="flex-row items-center border-b border-gray-300 py-3">
      {/* Employee Picture */}
      <Image
        source={{ uri: employee.picture }}
        className="w-12 h-12 rounded-full mr-3"
      />

      {/* Employee Details */}
      <View className="flex-1">
        <Text className="text-black text-[16px] font-semibold">{employee.name}</Text>
        <Text className="text-gray-400">{employee.contactNo}</Text>
        <Text className="text-gray-500">{employee.position}</Text>
      </View>

      {/* Vertical 3 Dots Dropdown */}
      <TouchableOpacity onPress={toggleDropdown}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View className="absolute top-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-20 mt-3">
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              onEdit(employee.id);
              setShowDropdown(false); // Close the dropdown after action
            }}
          >
            <Text className="text-gray-700">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              onDelete(employee.id);
              setShowDropdown(false); // Close the dropdown after action
            }}
          >
            <Text className="text-gray-700">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const EmployeesAccount = () => {
  // Sample employee data
  const employees = [
    {
      id: 1,
      picture: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "Employee Jr",
      contactNo: "123-456-7890",
      position: "Sales",
    },
    {
      id: 2,
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Joana Marie",
      contactNo: "987-654-3210",
      position: "Sales",
    },
    // Add more employees here...
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete employee with ID: ${id}`);
  };

  return (
    // Wrap the entire screen to detect taps outside
    <TouchableWithoutFeedback onPress={() => setActiveDropdown(null)}>
      <View className="pr-5 pl-5 flex-1">
        {/* This ensures clicks outside the component will close the dropdown */}
        {employees.map((employee) => (
          <EmployeeItem
            key={employee.id}
            employee={employee}
            onEdit={handleEdit}
            onDelete={handleDelete}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmployeesAccount;
