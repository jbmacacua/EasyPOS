import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons"; // Import Feather icons

import { useSession } from "@context/auth";
import { getAllEmployees, createUserAccount, deleteEmployee, updateEmployeeDetails, changeEmployeeRole} from "@api/accounts";

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
      {employee.profileImage?.trim() ? (
        <Image
          source={{
            uri: employee.profileImage,
          }}
          className="w-12 h-12 rounded-full mr-3 border border-black"
        />
      ) : (
        <View className="w-12 h-12 rounded-full mr-3 border border-black justify-center items-center">
          <Feather name="user" size={32} color="black" />
        </View>
      )}

      <View className="flex-1">
        <Text className="text-black text-[16px] font-semibold">
          {employee.firstName} {employee.lastName}
        </Text>
        <Text className="text-gray-400">{employee.contactNumber}</Text>
        <Text className="text-gray-500">{employee.role}</Text>
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
  const { session, userRole, businessId } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  const [employees, setEmployees] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newPicture, setNewPicture] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newRole, setNewRole] = useState("sales");
  const [isAdding, setIsAdding] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchEmployees = useCallback(async () => {
    if (!hasMore || loading || !businessId) return;
    setLoading(true);
    try {
      const response = await getAllEmployees(userId, businessId, page);
      if (response?.success && response?.result) {
        setEmployees((prevEmployees) => [...prevEmployees, ...response.result]);
        if (response.result.length < 10) {
          setHasMore(false);
        } else {
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        setHasMore(false);
        console.error("Failed to fetch employees:", response?.error);
      }
    } catch (error) {
      setHasMore(false);
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, businessId, page, hasMore, loading]);

  useEffect(() => {
    if (parsedSession && businessId) {
      fetchEmployees();
    }
  }, [parsedSession, businessId, fetchEmployees]);

  const clearFields = () => {
    setNewPicture("");
    setNewFirstName("");
    setNewLastName("");
    setNewAddress("");
    setNewContact("");
    setNewRole("Sales");
  };

  const handleAddEmployee = async () => {
    if (!businessId || !userId) return;
    setIsAdding(true); // Start loading
    try {
      const response = await createUserAccount(
        newFirstName,
        newLastName,
        newAddress,
        newContact,
        newRole,
        businessId,
        userId
      );
  
      if (response?.success && response?.employeeCredentials) {
        clearFields();
        setAddModalVisible(false);

        // Reset employee list state and pagination
        setEmployees([]);
        setPage(1);
        setHasMore(true);

        // Reload the list of employees
        await fetchEmployees();
      } else {
        console.error("Failed to create employee:", response?.error || "Unknown error");
        Alert.alert("Error", response?.error);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      Alert.alert("Error", "Unable to create employee.");
    } finally {
      setIsAdding(false); // End loading
    }
  };  
  

  const handleEdit = (employee) => {
    setEditingEmployee({ ...employee });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    setIsSavingEdit(true); // Start loading
    try {
      const response = await updateEmployeeDetails(
        editingEmployee.firstName,
        editingEmployee.lastName,
        editingEmployee.contactNumber,
        editingEmployee.address,
        userId,
        editingEmployee.id,
        businessId,
      );
  
      if (response?.success) {
        const oldEmployee = employees.find(emp => emp.id === editingEmployee.id);
  
        if (oldEmployee && oldEmployee.role !== editingEmployee.role) {
          const response = await changeEmployeeRole(
            editingEmployee.role,
            userId,
            editingEmployee.id,
            businessId
          );
          if (response?.error) {
            console.error("Failed to update employee role:", response?.error || "Unknown error");
            Alert.alert("Failed", "Error in updating employee role");
          }
        }
  
        setEmployees(prev =>
          prev.map(emp =>
            emp.id === editingEmployee.id ? editingEmployee : emp
          )
        );
      } else {
        console.error("Failed to update employee:", response?.error || "Unknown error");
        Alert.alert("Failed", "Error in updating employee record");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Error", "Unable to update employee");
    } finally {
      setIsSavingEdit(false); // End loading
      setEditModalVisible(false);
      setEditingEmployee(null);
    }
  };
  
  const handleDelete = async (id) => {
    console.log(id)
    try {
      const response = await deleteEmployee(
        userId,
        id,
        businessId
      );

      if (response?.success) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      } else {
        console.error("Failed to delete employee:", response?.error || "Unknown error");
        Alert.alert("Error", response?.error);
      }

    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Error", "Unable to delete employee");
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Adjust threshold as needed
    if (isCloseToBottom && hasMore && !loading) {
      fetchEmployees();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setActiveDropdown(null)}>
      <ScrollView
        className="pr-5 pl-5 flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={40} // Adjust as needed for performance
      >
        {employees.length > 0 &&
          employees.map((employee) => (
            <EmployeeItem
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          ))}

        {employees.length === 0 && !loading && (
          <View className="items-center mt-10">
            <Text className="text-gray-400 text-base">No employees found.</Text>
          </View>
        )}

        {loading && hasMore && (
          <View className="items-center py-5">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        <Modal
          animationType="slide"
          transparent
          visible={isAddModalVisible}
          onRequestClose={() => setAddModalVisible(!isAddModalVisible)}
        >
          <View className="flex-1 justify-center bg-black/60 p-5">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-xl font-bold mb-4">Add New Employee</Text>

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
                {["sales", "inventory"].map((role) => (
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
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-medium">Add</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={isEditModalVisible}
          onRequestClose={() => setEditModalVisible(!isEditModalVisible)}
        >
          <View className="flex-1 justify-center bg-black/60 p-5">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-xl font-bold mb-4">Edit Employee</Text>

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
                value={editingEmployee?.contactNumber || ""}
                onChangeText={(text) =>
                  setEditingEmployee((prev) => ({ ...prev, contactNumber: text }))
                }
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                className="bg-gray-100 p-4 rounded-lg mb-3 text-black"
              />

              <Text className="text-black font-medium mb-2">User Role</Text>
              <View className="flex-row mb-4 gap-4">
                {["sales", "inventory"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() =>
                      setEditingEmployee((prev) => ({ ...prev, role }))
                    }
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={`w-4 h-4 rounded-full border ${
                        editingEmployee?.role === role
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
                  className="border border-gray-400 px-4 py-4 rounded-lg" // Adjusted padding here
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveEdit}
                  disabled={isSavingEdit}
                  className={`bg-blue-500 p-4 rounded-lg ${isSavingEdit ? 'opacity-50' : ''}`}
                >
                  {isSavingEdit ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-semibold">Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EmployeesAccount;