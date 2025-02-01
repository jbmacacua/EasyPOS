import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData({ type, data }); // Store the scanned barcode data in state
    setScannerVisible(false); // Close the scanner after scanning
  };

  if (hasPermission === null) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={scannerVisible}
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                "aztec",
                "codabar",
                "code39",
                "code93",
                "code128",
                "datamatrix",
                "ean8",
                "ean13",
                "interleaved2of5",
                "pdf417",
                "qr",
                "upc_a",
                "upc_e"
              ],
            }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }} // Ensure it's on top
          />
          {scanned && (
            <Button
              title={"Tap to Scan Again"}
              onPress={() => setScanned(false)}
              color="#007BFF"
              style={{ padding: 10, borderRadius: 5 }}
            />
          )}
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 20, backgroundColor: "#333", padding: 10, borderRadius: 50 }}
            onPress={() => setScannerVisible(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Popup Barcode Data Display */}
      {barcodeData && (
        <View className="absolute bottom-24 mx-5 w-[80%] bg-white rounded-3xl shadow-lg mb-40">
          {/* Header Section */}
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
          </View>
          <View className="flex-row justify-between p-6">
            <Pressable
              className="flex-1 bg-[#007DA5] py-2 rounded-3xl mr-2"
              onPress={() => setBarcodeData(null)} 
            >
              <Text className="text-white text-center font-semibold">Cancel</Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-[#007DA5] py-2 rounded-3xl ml-2"
              onPress={() => router.push("/scannedBarcode")} // Navigate to the barcode details page
            >
              <Text className="text-white text-center font-semibold">Check</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Scanner Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          padding: 16,
          borderRadius: 50,
          position: "absolute",
          bottom: 20,
          right: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={() => setScannerVisible(true)}
      >
        <Ionicons name="barcode" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BarcodeScanner;
