import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EmployeeItem = ({
  employee,
  onEdit,
  onDelete,
  activeDropdown,
  setActiveDropdown,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setActiveDropdown(showDropdown ? null : employee.id);
  };

  useEffect(() => {
    if (activeDropdown !== employee.id) {
      setShowDropdown(false);
    }
  }, [activeDropdown, employee.id]);

  return (
    <View className="flex-row items-center border-b border-gray-300 py-3">
      <Image
        source={{ uri: employee.picture }}
        className="w-12 h-12 rounded-full mr-3 border border-black"
      />
      <View className="flex-1">
        <Text className="text-black text-[16px] font-semibold">
          {employee.name}
        </Text>
        <Text className="text-gray-400">{employee.contactNo}</Text>
        <Text className="text-gray-500">{employee.position}</Text>
      </View>
      <TouchableOpacity onPress={toggleDropdown}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
      {showDropdown && (
        <View className="absolute top-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-20 mt-3">
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              onEdit(employee);
              setShowDropdown(false);
            }}
          >
            <Text className="text-gray-700">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2"
            onPress={() => {
              onDelete(employee.id);
              setShowDropdown(false);
            }}
          >
            <Text className="text-gray-700">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const EmployeesAccount = ({ isAddModalVisible, setAddModalVisible }) => {
  const [employees, setEmployees] = useState([
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
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // States for new employee
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newPicture, setNewPicture] = useState("");

  // Edit modal state
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleAddEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: newName,
      contactNo: newContact,
      position: newPosition,
      picture: newPicture || "https://randomuser.me/api/portraits/lego/1.jpg",
    };
    setEmployees([...employees, newEmployee]);
    clearFields();
    setAddModalVisible(false);
  };

  const handleCancelAdd = () => {
    clearFields();
    setAddModalVisible(false);
  };

  const clearFields = () => {
    setNewName("");
    setNewContact("");
    setNewPosition("");
    setNewPicture("");
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee.id ? editingEmployee : emp
      )
    );
    setEditModalVisible(false);
    setEditingEmployee(null);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveDropdown(null)}>
      <View className="pr-5 pl-5 flex-1">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <EmployeeItem
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          ))
        ) : (
          <View className="items-center mt-10">
            <Text className="text-gray-400 text-base">No employees found.</Text>
          </View>
        )}

        {/* Add Modal */}
        <Modal visible={isAddModalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center bg-black/60 p-5">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-xl font-bold mb-4">Add New Employee</Text>

              <Text className="text-black font-medium mb-1">Picture URL</Text>
              <TextInput
                value={newPicture}
                onChangeText={setNewPicture}
                placeholder="Enter image URL"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />
              {newPicture ? (
                <Image
                  source={{ uri: newPicture }}
                  className="w-20 h-20 rounded-full self-center mb-4"
                />
              ) : null}

              <Text className="text-black font-medium mb-1">Name</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter full name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Contact Number</Text>
              <TextInput
                value={newContact}
                onChangeText={setNewContact}
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Position</Text>
              <TextInput
                value={newPosition}
                onChangeText={setNewPosition}
                placeholder="Enter position"
                className="bg-gray-100 p-4 rounded-lg mb-4 text-black"
              />

              <View className="flex-row justify-end gap-4">
                <TouchableOpacity
                  onPress={handleCancelAdd}
                  className="border border-gray-400 px-5 py-2 rounded-lg"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddEmployee}
                  className="bg-[#3C80B4] px-6 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        <Modal visible={isEditModalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center bg-black/60 p-5">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-xl font-bold mb-4">Edit Employee</Text>

              <Text className="text-black font-medium mb-1">Picture URL</Text>
              <TextInput
                value={editingEmployee?.picture || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, picture: text }))
                }
                placeholder="Enter image URL"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />
              {editingEmployee?.picture ? (
                <Image
                  source={{ uri: editingEmployee.picture }}
                  className="w-20 h-20 rounded-full self-center mb-4"
                />
              ) : null}

              <Text className="text-black font-medium mb-1">Name</Text>
              <TextInput
                value={editingEmployee?.name || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter full name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Contact Number</Text>
              <TextInput
                value={editingEmployee?.contactNo || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, contactNo: text }))
                }
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Position</Text>
              <TextInput
                value={editingEmployee?.position || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, position: text }))
                }
                placeholder="Enter position"
                className="bg-gray-100 p-4 rounded-lg mb-4 text-black"
              />

              <View className="flex-row justify-end gap-4">
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  className="border border-gray-400 px-5 py-2 rounded-lg"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  className="bg-[#3C80B4] px-6 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmployeesAccount;
