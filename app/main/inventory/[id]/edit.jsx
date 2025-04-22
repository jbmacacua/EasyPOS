// app/main/inventory/[id]/edit.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductById, editProduct } from '@api/inventory';
import { supabase } from '@utils/supabase';

const EditProduct = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    totalQuantitySinceRestock: '',
  });

  const userId = supabase.auth.getUser().then(res => res.data.user.id); // you can memo this or store in context

  useEffect(() => {
    const loadProduct = async () => {
      const { success, productDetails, error } = await getProductById(await userId, id);

      if (!success || !productDetails) {
        Alert.alert('Error', 'Item does not exist');
        return;
      }

      setProduct(productDetails);
      setForm({
        name: productDetails.name || '',
        price: productDetails.price?.toString() || '',
        quantity: productDetails.quantity?.toString() || '',
        totalQuantitySinceRestock: productDetails.total_quantity_since_restock?.toString() || '',
      });
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.quantity || !form.totalQuantitySinceRestock) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    const { success, error } = await editProduct(
      await userId,
      id,
      product.business_id,
      form.name,
      parseFloat(form.price),
      parseInt(form.quantity),
      parseInt(form.totalQuantitySinceRestock)
    );

    if (!success) {
      Alert.alert('Failed', error || 'Could not update product');
      return;
    }

    Alert.alert('Success', 'Product updated successfully');
    router.back(); 
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007DA5" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 py-6">
      <Text className="text-2xl font-bold mb-4">Edit Product</Text>

      <Text className="mb-1">Name</Text>
      <TextInput
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1">Price</Text>
      <TextInput
        value={form.price}
        onChangeText={(text) => setForm({ ...form, price: text })}
        keyboardType="decimal-pad"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1">Stock Left</Text>
      <TextInput
        value={form.quantity}
        onChangeText={(text) => setForm({ ...form, quantity: text })}
        keyboardType="number-pad"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1">Total Quantity Since Restock</Text>
      <TextInput
        value={form.totalQuantitySinceRestock}
        onChangeText={(text) => setForm({ ...form, totalQuantitySinceRestock: text })}
        keyboardType="number-pad"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-[#007DA5] py-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center font-semibold text-lg">Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={router.back}
        className="bg-[#007DA5] py-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProduct;
