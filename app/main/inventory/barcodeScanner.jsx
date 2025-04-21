import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { checkExistingProduct } from "@api/inventory";


const BarcodeScanner = ({ userId, businessId }) => {
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

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannerVisible(false);
    const scanned = { type, data };
    setBarcodeData(scanned);
    await checkInventory(scanned.data);
  };

  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  const checkInventory = async (barCode) => {
    if (!barCode || !userId || !businessId) return;

    console.log("Checking barcode:", barCode);
    console.log("Checking businessId:", businessId);

    setChecking(true);
    try {
      const { success, barcodeAvailable, error } = await checkExistingProduct(
        userId,
        barCode,
        businessId
      );

      setChecking(false);

      if (!success) {
        console.error("Check failed:", error);
        return;
      }

      setBarcodeData((prev) => ({
        ...prev,
        status: barcodeAvailable ? "Nonexistent in Inventory" : "Exists in Inventory",
      }));
    } catch (err) {
      console.error("Unexpected error:", err);
      setChecking(false);
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>
        Requesting for camera permission
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>
        No access to camera
      </Text>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={scannerVisible}
        onRequestClose={() => setScannerVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13", "upc_a"],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
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
      </Modal>

      {barcodeData && (
        <View className="absolute bottom-24 mx-5 w-[80%] bg-white rounded-3xl shadow-lg mb-40">
          <View className="bg-[#3C80B4] rounded-t-3xl p-5">
            <Text className="text-center text-lg font-semibold text-white">
              Scanned Barcode
            </Text>
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
  <Pressable
    className="flex-1 bg-[#3C80B4] py-2 rounded-3xl"
    onPress={() => setBarcodeData(null)}
  >
    <Text className="text-white text-center font-semibold">
      {barcodeData?.status === "Exists in Inventory" ? "Okay" : "Cancel"}
    </Text>
  </Pressable>

  {!checking && barcodeData?.status !== "Exists in Inventory" && (
    <Pressable
      className="flex-1 bg-[#3C80B4] py-2 rounded-3xl ml-2"
      onPress={() => {
        setBarcodeData(null);
        router.push({
          pathname: "/main/inventory/addProduct",
          params: {
            barcode: barcodeData.data,
          },
        });
      }}
    >
      <Text className="text-white text-center font-semibold">Add</Text>
    </Pressable>
  )}
</View>

        </View>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#007DA5",
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
        onPress={openScanner}
      >
        <Ionicons name="barcode" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BarcodeScanner;