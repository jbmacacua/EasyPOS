import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

const ProductDetails = ({ visible, product, onClose, onAddProduct }) => {
    const [quantity, setQuantity] = useState(1); // Initial quantity set to 1
    const [isFocused, setIsFocused] = useState(false); // Track focus state

    const increaseQuantity = () => setQuantity((prevQuantity) => prevQuantity + 1);
    const decreaseQuantity = () => setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));

    const handleQuantityChange = (text) => {
        // Only update if the value is a valid number greater than 0 or an empty string
        if (text === "" || /^[1-9]\d*$/.test(text)) {
            setQuantity(text === "" ? "" : parseInt(text));
        }
    };

    const handleBlur = () => {
        if (quantity === "") {
            setQuantity(1); // Reset to 1 if empty when the input loses focus
        }
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    useEffect(() => {
        // Reset quantity to 1 when modal is closed
        if (!visible) {
            setQuantity(1);
        }
    }, [visible]);

    if (!product) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-opacity-0">
                <View className="bg-white p-5 rounded-3xl w-4/5 max-w-md">
                    <TouchableOpacity
                        className="absolute top-4 right-5"
                        onPress={() => {
                            setQuantity(1); // Reset quantity when closing the modal
                            onClose();
                        }}
                    >
                        <Feather name="x" size={32} color="black" />
                    </TouchableOpacity>

                    <View className="items-left mt-3">
                        <Text className="text-3xl font-bold my-2">{product.productName}</Text>
                        <Text className="text-lg text-black my-1">
                            Barcode: {product.barcode}
                        </Text>
                        <Text className="text-2xl text-[#3C80B4] font-bold">
                            ₱ {product.price.toFixed(2)}
                        </Text>
                    </View>

                    {/* Align quantity controls to the right */}
                    <View className="flex-row justify-end items-center mb-2">
                        <Text className="text-lg mr-2">Qty:</Text>
                        <TouchableOpacity onPress={decreaseQuantity} className="rounded-full">
                            <Feather name="minus-square" size={20} color="black" />
                        </TouchableOpacity>

                        <TextInput
                            style={{}}
                            value={String(quantity)} // Ensure the value is a string
                            keyboardType="numeric"
                            onChangeText={handleQuantityChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            className="text-center text-lg border border-[#ddd] rounded-lg mx-3"
                        />

                        <TouchableOpacity onPress={increaseQuantity} className="rounded-full">
                            <Feather name="plus-square" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between mt-5">
                        <Pressable
                            className="flex-1 bg-[#3C80B4] p-3 rounded-full mx-2"
                            onPress={() => onAddProduct(product, quantity)}
                        >
                            <Text className="text-center text-white font-bold">Add</Text>
                        </Pressable>
                        <Pressable
                            className="flex-1 bg-red-500 p-3 rounded-full mx-2"
                            onPress={() => {
                                setQuantity(1); // Reset quantity when closing the modal
                                onClose();
                            }}
                        >
                            <Text className="text-center text-white font-bold">Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ProductDetails;
