import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SaleBarcodeScanner = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState(null);
    const [checking, setChecking] = useState(false);
    const [productAdded, setProductAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getCameraPermissions();
    }, []);

    const handleDoneClick = () => {
        router.push('/main/sales/addedProducts');
    };

    const products = [
        {
            name: "Strawberry Pancake",
            description: "Delicious and fluffy pancake topped with strawberries",
            price: 29,
        },
        {
            name: "Chocolate Muffin",
            description: "Rich and moist muffin with chunks of chocolate",
            price: 25,
        },
        {
            name: "Vanilla Donut",
            description: "Soft and sweet vanilla-flavored donut with sprinkles",
            price: 20,
        },
        {
            name: "Blueberry Cheesecake",
            description: "Creamy cheesecake with fresh blueberries on top",
            price: 50,
        },
        {
            name: "Caramel Latte",
            description: "Smooth espresso with caramel syrup and steamed milk",
            price: 45,
        },
    ];

    const getRandomProduct = () => {
        return products[Math.floor(Math.random() * products.length)];
    };

    const saveScannedBarcode = async (barcode) => {
        try {
            const storedBarcodes = await AsyncStorage.getItem("scannedBarcodes");
            let barcodes = storedBarcodes ? JSON.parse(storedBarcodes) : [];

            if (!barcodes.some((item) => item.barcode === barcode)) {
                const newBarcode = { barcode, scannedAt: new Date().toLocaleString() };
                barcodes.push(newBarcode);

                await AsyncStorage.setItem("scannedBarcodes", JSON.stringify(barcodes));
                console.log(" Barcode saved:", newBarcode);
            }
        } catch (error) {
            console.error("Error saving barcode:", error);
        }
    };

    const handleBarcodeScanned = ({ type, data }) => {
        setScanned(true);
        const randomProduct = getRandomProduct();
        setBarcodeData({ type, data, ...randomProduct });
        saveScannedBarcode(data);
    };


    const openScanner = () => {
        setScanned(false);
        setBarcodeData(null);
        setScannerVisible(true);
    };

    const addProduct = async () => {
        setProductAdded(true);
        setBarcodeData(null);
        setScanned(false);
    
        // Create a new product object
        const newProduct = {
            name: barcodeData.name,
            description: barcodeData.description,
            price: barcodeData.price,
            quantity: quantity,
        };
    
        try {
            // Retrieve existing products from AsyncStorage
            const storedProducts = await AsyncStorage.getItem("addedProducts");
            const products = storedProducts ? JSON.parse(storedProducts) : [];
    
            // Add the new product to the array
            products.push(newProduct);
    
            // Save the updated products array back to AsyncStorage
            await AsyncStorage.setItem("addedProducts", JSON.stringify(products));
    
            console.log("Product added:", newProduct);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    
        setTimeout(() => {
            setProductAdded(false);
        }, 2000);
    };
    


    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    if (hasPermission === null) {
        return <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <Modal animationType="slide" transparent={false} visible={scannerVisible} onRequestClose={() => setScannerVisible(false)}>
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }}
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                    {barcodeData && (
                        <View style={{
                            position: "absolute",
                            bottom: "10%",
                            left: "5%",
                            right: "5%",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            padding: 20,
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 10,
                        }}>
                            <Text style={{ color: "black", fontSize: 18, textAlign: "center" }}>
                                Scanned Barcode: {barcodeData.data}
                            </Text>
                            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                                {barcodeData.name}
                            </Text>
                            <Text style={{ color: "black", fontSize: 14, textAlign: "center" }}>
                                {barcodeData.description}
                            </Text>
                            <Text style={{ color: "black", fontSize: 18, textAlign: "center", marginVertical: 10 }}>
                                Php: {barcodeData.price}
                            </Text>

                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                                <TouchableOpacity onPress={decrementQuantity} style={{ padding: 10, backgroundColor: "#3C80B4", borderRadius: 5, marginRight: 10 }}>
                                    <Text style={{ color: "white", fontSize: 20 }}>-</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 20, color: "black" }}>{quantity}</Text>
                                <TouchableOpacity onPress={incrementQuantity} style={{ padding: 10, backgroundColor: "#3C80B4", borderRadius: 5, marginLeft: 10 }}>
                                    <Text style={{ color: "white", fontSize: 20 }}>+</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: "#f44336", borderRadius: 5, flex: 1, marginRight: 10 }}
                                    onPress={() => {
                                        setBarcodeData(null);
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: "#3C80B4", borderRadius: 5, flex: 1, marginLeft: 10 }}
                                    onPress={addProduct}
                                >
                                    <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>Add Product</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 20,
                            backgroundColor: "#333",
                            padding: 10,
                            borderRadius: 50,
                        }}
                        onPress={() => setScannerVisible(false)}
                    >
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        backgroundColor: "#007DA5",
                        padding: 12,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={handleDoneClick}
                >
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>Done</Text>
                </TouchableOpacity>

            </Modal>

            <TouchableOpacity
                style={{
                    backgroundColor: "#007DA5", padding: 16, borderRadius: 50, position: "absolute", bottom: 20, right: 20,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5
                }}
                onPress={openScanner}
            >
                <Ionicons name="scan" size={32} color="white" />
            </TouchableOpacity>

            {productAdded && (
                <View style={{
                    position: "absolute", bottom: 80, backgroundColor: "green", padding: 10, borderRadius: 5,
                    justifyContent: "center", alignItems: "center"
                }}>
                    <Text style={{ color: "white", fontSize: 16 }}>Product Added</Text>
                </View>
            )}

            {checking && (
                <View style={{
                    position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -50 }, { translateY: -50 }],
                    backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 20, borderRadius: 10, alignItems: "center"
                }}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={{ color: "white", marginTop: 10 }}>Checking Inventory...</Text>
                </View>
            )}
        </View>
    );
};

export default SaleBarcodeScanner;
