// SalesBarcodeScanner.js
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductDetails from "./productDetails";
import AddedProductsList from "./addedProductLists"; // Import the new component

const SalesBarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [barcodeData, setBarcodeData] = useState(null);
  const [productDetails, setProductDetails] = useState(null); 
  const [checking, setChecking] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false); 
  const [scannerVisible, setScannerVisible] = useState(false); 
  const [addedProducts, setAddedProducts] = useState([]); // Store added products
  const [productListVisible, setProductListVisible] = useState(false); // Show the product list overlay

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

      if (!barcodes.some((item) => item.barcode === barcode)) {
        const newBarcode = { barcode, scannedAt: new Date().toLocaleString() };
        barcodes.push(newBarcode);

        await AsyncStorage.setItem("scannedBarcodes", JSON.stringify(barcodes));
      }
    } catch (error) {
      console.error("Error saving barcode:", error);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    setBarcodeData({ type, data });
    saveScannedBarcode(data);
    checkInventory(data); // Check the product based on the scanned barcode
  };

  const checkInventory = async (barcode) => {
    setChecking(true);

    try {
      const storedProducts = await AsyncStorage.getItem("products");
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      const existingProduct = products.find((product) => String(product.barcode) === String(barcode));

      setChecking(false);
      if (existingProduct) {
        setProductDetails(existingProduct); 
        setProductModalVisible(true); 
      } else {
        setBarcodeData((prev) => ({
          ...prev,
          status: "Nonexistent in Inventory",
        }));
      }
    } catch (error) {
      setChecking(false);
      console.error("Error checking inventory:", error);
    }
  };

  const addProductToList = (product, quantity) => {
    setAddedProducts((prevProducts) => [
      ...prevProducts,
      { ...product, quantity },
    ]);
    setProductModalVisible(false); // Close the modal after adding the product
  };

  const updateProductQuantity = (updatedProducts) => {
    setAddedProducts(updatedProducts);
  };

  const deleteProduct = (updatedProducts) => {
    setAddedProducts(updatedProducts);
  };

  if (hasPermission === null) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#666" }}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={{ textAlign: "center", fontSize: 18, color: "#f00" }}>No access to camera</Text>;
  }

  const closeScanner = () => {
    setScannerVisible(false); // Hide the camera when the close button is pressed
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal animationType="slide" transparent={false} visible={scannerVisible} onRequestClose={closeScanner}>
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
          <CameraView
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Close Button for Camera */}
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 20, backgroundColor: "#333", padding: 10, borderRadius: 50 }}
            onPress={closeScanner}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>

          {/* Show the Product List as an overlay */}
          {productListVisible && (
            <AddedProductsList
              visible={productListVisible}
              onClose={() => setProductListVisible(false)}
              products={addedProducts}
              onUpdateQuantity={updateProductQuantity}
              onDeleteProduct={deleteProduct}
            />
          )}

          {/* Button to toggle the added products list visibility */}
          <TouchableOpacity
            className="absolute bottom-5 right-5 bg-blue-500 p-4 rounded-full shadow-lg"
            onPress={() => setProductListVisible((prev) => !prev)} // Toggle product list visibility
          >
            <Feather name="shopping-bag" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Product Details Modal */}
      <ProductDetails
        visible={productModalVisible}
        product={productDetails}
        onClose={() => setProductModalVisible(false)}
        onAddProduct={addProductToList}
      />
      
      {/* Camera Start Button */}
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-full absolute bottom-5 right-5 shadow-lg"
        onPress={() => setScannerVisible(true)}
      >
        <Ionicons name="barcode" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SalesBarcodeScanner;
