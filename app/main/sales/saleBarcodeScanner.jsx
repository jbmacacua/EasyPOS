import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { checkProductAvailability } from "@api/sales";
import { useSession } from "@context/auth";
import { Alert } from "react-native";

const SaleBarcodeScanner = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState(null);
    const [checking, setChecking] = useState(false);
    const [productAdded, setProductAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedProducts, setAddedProducts] = useState([]);

    const router = useRouter();
    const { session, businessId } = useSession();
    const userId = session ? JSON.parse(session)?.user?.id : null;

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = async ({ type, data }) => {
        setScanned(true);
        setChecking(true);

        try {
            const response = await checkProductAvailability(userId, data, businessId, quantity);
            if (response.success && response.data.length > 0) {
                const product = response.data[0];
                setBarcodeData({
                    type,
                    data,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    productId: product.id,
                });
            } else {
                Alert.alert(
                    "Alert",
                    "Product not found or insufficient stock.",
                    [
                        {
                            text: "OK",
                            onPress: () => setScanned(false), // Only reset scanned when OK is pressed
                        },
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            console.error("Error checking product:", error);
            alert("Error checking product.");
            setScanned(false);
        } finally {
            setChecking(false);
        }
    };

    const addProduct = () => {
        if (!barcodeData?.productId) return;

        const newProduct = {
            productName: barcodeData.name,
            productId: barcodeData.productId,
            quantity,
            price: barcodeData.price,
        };

        setAddedProducts([...addedProducts, newProduct]);
        setProductAdded(true);
        setBarcodeData(null);
        setScanned(false);
        setQuantity(1);

        setTimeout(() => setProductAdded(false), 2000);
    };

    const handleDoneClick = () => {
        if (addedProducts.length === 0) {
            setScanned(true);
            Alert.alert(
                "Alert",
                "No products added.",
                [
                    {
                        text: "OK",
                        onPress: () => setScanned(false), // Only reset scanned when OK is pressed
                    },
                ],
                { cancelable: false }
            );
            return;
        }

        setScannerVisible(false);

        router.push({
            pathname: "/main/sales/addedProducts",
            params: {
                items: JSON.stringify(addedProducts),
            },
        });

        setAddedProducts([]);
    };

    const openScanner = () => {
        setScanned(false);
        setBarcodeData(null);
        setQuantity(1);
        setScannerVisible(true);
    };

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
    const handleQuantityChange = (text) => {
        if (text === "" || /^[1-9]\d*$/.test(text)) {
            setQuantity(text === "" ? "" : parseInt(text));
        }
    };

    if (hasPermission === null) {
        return <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={scannerVisible}
                onRequestClose={() => {
                    setScannerVisible(false);
                    setScanned(false);
                    setBarcodeData(null);
                    setChecking(false);
                    setQuantity(1);
                }}
            >
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }}
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    />

                    {barcodeData && (
                        <View style={{
                            position: "absolute", bottom: "10%", left: "5%", right: "5%",
                            backgroundColor: "rgba(255, 255, 255, 0.9)", padding: 20,
                            borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10,
                        }}>
                            <Text style={{ color: "black", fontSize: 18, textAlign: "center" }}>Scanned Barcode: {barcodeData.data}</Text>
                            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>{barcodeData.name}</Text>
                            <Text style={{ color: "black", fontSize: 14, textAlign: "center" }}>{barcodeData.description}</Text>
                            <Text style={{ color: "black", fontSize: 18, textAlign: "center", marginVertical: 10 }}>Php: {barcodeData.price}</Text>

                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                                <TouchableOpacity onPress={decrementQuantity} style={{ padding: 10, backgroundColor: "#3C80B4", borderRadius: 5, marginRight: 10 }}>
                                    <Text style={{ color: "white", fontSize: 20 }}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    value={String(quantity)}
                                    keyboardType="numeric"
                                    onChangeText={handleQuantityChange}
                                    style={{ textAlign: "center", fontSize: 18, borderWidth: 1, borderColor: "#ddd", padding: 5, borderRadius: 5, width: 60 }}
                                />
                                <TouchableOpacity onPress={incrementQuantity} style={{ padding: 10, backgroundColor: "#3C80B4", borderRadius: 5, marginLeft: 10 }}>
                                    <Text style={{ color: "white", fontSize: 20 }}>+</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: "#f44336", borderRadius: 5, flex: 1, marginRight: 10 }}
                                    onPress={() => {
                                        setBarcodeData(null);
                                        setScanned(false);
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
                            position: "absolute", top: 10, right: 20,
                            backgroundColor: "#333", padding: 10, borderRadius: 50,
                        }}
                        onPress={() => {
                            setScannerVisible(false);
                            setQuantity(1);
                            setAddedProducts([]);
                        }}
                    >
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            position: "absolute", bottom: 20, right: 20,
                            backgroundColor: "#007DA5", padding: 12, borderRadius: 8,
                            flexDirection: "row", alignItems: "center",
                        }}
                        onPress={handleDoneClick}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="white" />
                        <Text style={{ color: "white", fontSize: 16, marginLeft: 5 }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <TouchableOpacity
                style={{
                    backgroundColor: "#007DA5", padding: 16, borderRadius: 50,
                    position: "absolute", bottom: 20, right: 20,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
                }}
                onPress={openScanner}
            >
                <Ionicons name="scan" size={32} color="white" />
            </TouchableOpacity>

            {productAdded && (
                <View style={{
                    position: "absolute", bottom: 80, backgroundColor: "green", padding: 10,
                    borderRadius: 5, justifyContent: "center", alignItems: "center"
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
