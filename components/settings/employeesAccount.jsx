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
          {employee.firstName} {employee.lastName}
        </Text>
        <Text className="text-gray-400">{employee.contactNo}</Text>
        <Text className="text-gray-500">{employee.userRole}</Text>
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
      firstName: "Employee",
      lastName: "Jr",
      address: "123 Example Street",
      contactNo: "123-456-7890",
      userRole: "Sales",
    },
    {
      id: 2,
      picture: "https://randomuser.me/api/portraits/women/2.jpg",
      firstName: "Joana",
      lastName: "Marie",
      address: "456 Avenue Road",
      contactNo: "987-654-3210",
      userRole: "Inventory",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // States for new employee
  const [newPicture, setNewPicture] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newRole, setNewRole] = useState("Sales");

  // Edit modal state
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const clearFields = () => {
    setNewPicture("");
    setNewFirstName("");
    setNewLastName("");
    setNewAddress("");
    setNewContact("");
    setNewRole("Sales");
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      picture: newPicture || "https://randomuser.me/api/portraits/lego/1.jpg",
      firstName: newFirstName,
      lastName: newLastName,
      address: newAddress,
      contactNo: newContact,
      userRole: newRole,
    };
    setEmployees([...employees, newEmployee]);
    clearFields();
    setAddModalVisible(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee({ ...employee });
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

              <Text className="text-black font-medium mb-1">First Name</Text>
              <TextInput
                value={newFirstName}
                onChangeText={setNewFirstName}
                placeholder="Enter first name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Last Name</Text>
              <TextInput
                value={newLastName}
                onChangeText={setNewLastName}
                placeholder="Enter last name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Address</Text>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="Enter address"
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

              <Text className="text-black font-medium mb-2">User Role</Text>
              <View className="flex-row mb-4 gap-4">
                {["Sales", "Inventory"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setNewRole(role)}
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-4 h-4 rounded-full border ${
                        newRole === role ? "bg-[#3C80B4]" : "border-gray-400"
                      }`}
                    />
                    <Text className="text-black">{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row justify-end gap-4">
                <TouchableOpacity
                  onPress={() => {
                    clearFields();
                    setAddModalVisible(false);
                  }}
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

              <Text className="text-black font-medium mb-1">First Name</Text>
              <TextInput
                value={editingEmployee?.firstName || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, firstName: text }))
                }
                placeholder="Enter first name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Last Name</Text>
              <TextInput
                value={editingEmployee?.lastName || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, lastName: text }))
                }
                placeholder="Enter last name"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-1">Address</Text>
              <TextInput
                value={editingEmployee?.address || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, address: text }))
                }
                placeholder="Enter address"
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

              <Text className="text-black font-medium mb-2">User Role</Text>
              <View className="flex-row mb-4 gap-4">
                {["Sales", "Inventory"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() =>
                      setEditingEmployee((prev) => ({ ...prev, userRole: role }))
                    }
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-4 h-4 rounded-full border ${
                        editingEmployee?.userRole === role
                          ? "bg-[#3C80B4]"
                          : "border-gray-400"
                      }`}
                    />
                    <Text className="text-black">{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>

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
