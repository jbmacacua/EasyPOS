import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const saveScannedBarcode = async (barcode) => {
    try {
      const storedBarcodes = await AsyncStorage.getItem("scannedBarcodes");
      let barcodes = storedBarcodes ? JSON.parse(storedBarcodes) : [];

      // Avoid duplicates
      if (!barcodes.some((item) => item.barcode === barcode)) {
        const newBarcode = { barcode, scannedAt: new Date().toLocaleString() };
        barcodes.push(newBarcode);

        await AsyncStorage.setItem("scannedBarcodes", JSON.stringify(barcodes));
        console.log(" Barcode saved:", newBarcode); // Debug log
      }
    } catch (error) {
      console.error("Error saving barcode:", error);
    }
  };



  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData({ type, data });
    setScannerVisible(false);
    saveScannedBarcode(data);
  };

  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };


  const checkInventory = async () => {
    if (!barcodeData || !barcodeData.data) return;

    setChecking(true);

    try {
      const storedProducts = await AsyncStorage.getItem("products");
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      console.log("Products:", products);  // Debug log for checking products
      console.log("Scanned Barcode:", barcodeData.data);  // Debug log for checking barcode data

      const existingProduct = products.find((product) => String(product.barcode) === String(barcodeData.data));

      // Delay the state update to simulate checking
      setTimeout(() => {
        setChecking(false);
        setBarcodeData((prev) => ({
          ...prev,
          status: existingProduct ? "Exists in Inventory" : "Nonexistent in Inventory", // Set the status explicitly
        }));

        saveScannedBarcode(barcodeData.data);
      }, 1000);
    } catch (error) {
      console.error("Error checking inventory:", error);
      setChecking(false);
    }
  };



  if (hasPermission === null) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal animationType="slide" transparent={false} visible={scannerVisible} onRequestClose={() => setScannerVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
          <CameraView onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
          <TouchableOpacity style={{ position: "absolute", top: 10, right: 20, backgroundColor: "#333", padding: 10, borderRadius: 50 }} onPress={() => setScannerVisible(false)}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {barcodeData && (
        <View className="absolute bottom-24 mx-5 w-[80%] bg-white rounded-3xl shadow-lg mb-40">
          <View className="bg-[#3C80B4] rounded-t-3xl p-5">
            <Text className="text-center text-lg font-semibold text-white">Scanned Barcode</Text>
          </View>
          <View className="mt-4 ml-6">
            <Text className="text-gray-600 text-base">
              <Text className="font-semibold">Date Scanned: </Text>
              {new Date().toLocaleDateString()}
            </Text>
            <Text className="text-gray-600 text-base mt-2">
              <Text className="font-semibold">Barcode No.: </Text>
              {barcodeData.data}
            </Text>
            <Text className="text-gray-600 text-base mt-2">
              <Text className="font-semibold">Status: </Text>
              {checking ? (
                <ActivityIndicator size="small" color="#007DA5" />
              ) : (
                barcodeData.status || "Nonexistent in Inventory"
              )}
            </Text>


          </View>
          <View className="flex-row justify-between p-6">
            <Pressable className="flex-1 bg-[#3C80B4] py-2 rounded-3xl mr-2" onPress={() => setBarcodeData(null)}>
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </Pressable>
            {!checking && (
              <Pressable
                className="flex-1 bg-[#3C80B4] py-2 rounded-3xl ml-2"
                onPress={() => {
                  setBarcodeData(null);
                  router.push("/main/inventory/addProduct");
                }}
              >
                <Text className="text-white text-center font-semibold">Add</Text>
              </Pressable>

            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={{ backgroundColor: "#007DA5", padding: 16, borderRadius: 50, position: "absolute", bottom: 20, right: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}
        onPress={openScanner}
      >
        <Ionicons name="barcode" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BarcodeScanner;