import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddedProductComponent = () => {
    const [addedProducts, setAddedProducts] = useState([]); // Define the state for added products

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Retrieve products from AsyncStorage
                const storedProducts = await AsyncStorage.getItem("addedProducts");
                if (storedProducts) {
                    setAddedProducts(JSON.parse(storedProducts)); // Set the state to the stored products
                }
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };

        loadProducts();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Added Products</Text>
            {addedProducts.length === 0 ? (
                <Text>No products added yet</Text>
            ) : (
                addedProducts.map((product, index) => (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{product.name}</Text>
                        <Text>{product.description}</Text>
                        <Text>Price: Php {product.price}</Text>
                        <Text>Quantity: {product.quantity}</Text>
                    </View>
                ))
            )}
        </View>
    );
};

export default AddedProductComponent;
