// AddedProductsList.js
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const AddedProductsList = ({ visible, onClose, products, onUpdateQuantity, onDeleteProduct, onConfirmOrder }) => {
  const [updatedProducts, setUpdatedProducts] = useState(products);

  useEffect(() => {
    setUpdatedProducts(products); // Update the product list when it changes
  }, [products]);

  const increaseQuantity = (index) => {
    const newProducts = [...updatedProducts];
    newProducts[index].quantity += 1;
    setUpdatedProducts(newProducts);
    onUpdateQuantity(newProducts); // Notify parent component
  };

  const decreaseQuantity = (index) => {
    const newProducts = [...updatedProducts];
    if (newProducts[index].quantity > 1) {
      newProducts[index].quantity -= 1;
      setUpdatedProducts(newProducts);
      onUpdateQuantity(newProducts); // Notify parent component
    }
  };

  const deleteProduct = (index) => {
    const newProducts = updatedProducts.filter((_, i) => i !== index);
    setUpdatedProducts(newProducts);
    onDeleteProduct(newProducts); // Notify parent component
  };

  const calculateTotal = () => {
    return updatedProducts.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return updatedProducts.reduce((total, product) => total + product.quantity, 0);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-white p-4">
        <TouchableOpacity onPress={onClose} className="absolute top-4 right-4">
          <Ionicons name="close" size={32} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-4">Added Products</Text>
        {updatedProducts.length === 0 ? (
          <Text className="text-lg">No products added yet.</Text>
        ) : (
          <FlatList
            data={updatedProducts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center my-4 w-full border-b border-gray-300 pb-4">
                {/* Product Number */}
                <Text className="text-lg flex-1">{index + 1}. {item.productName}</Text>

                {/* Price below product name */}
                <Text className="text-sm text-gray-500">${item.price.toFixed(2)}</Text>

                {/* Quantity Controls */}
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => decreaseQuantity(index)} className="mr-2">
                    <Feather name="minus-square" size={24} color="black" />
                  </TouchableOpacity>
                  <Text className="text-lg">{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(index)} className="ml-2">
                    <Feather name="plus-square" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                {/* Delete Button */}
                <TouchableOpacity onPress={() => deleteProduct(index)} className="ml-4">
                  <Feather name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Total Quantity */}
        <View className="mt-4 w-full flex-row justify-between items-center border-t border-gray-300 pt-4">
          <Text className="text-xl font-bold">Total Quantity: {calculateTotalQuantity()}</Text>
          <Text className="text-xl font-bold">Total: Php {calculateTotal()}</Text>
        </View>

        {/* Buttons for Cancel and Confirm Order */}
        <View className="flex-row justify-between w-full mt-6">
          <TouchableOpacity onPress={onConfirmOrder} className="bg-blue-500 p-4 rounded-full flex-1 mr-2">
            <Text className="text-white font-bold text-center">Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="bg-red-500 p-4 rounded-full flex-1 ml-2">
            <Text className="text-white font-bold text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddedProductsList;
