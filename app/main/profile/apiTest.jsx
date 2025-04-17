import { View, Text, Button } from 'react-native';
import { useMemo, useState } from 'react';
import { useSession } from '@context/auth';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { uploadProductImage } from '../../../api/inventory'; // Import the uploadProductImage API

export default function ApiTestScreen() {
  const { session, businessId } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [image, setImage] = useState(null);

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session:', error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  const handleImagePick = async () => {
    // Ask for permission to access the device's photo library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open image picker to select an image
    const pickedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickedImage.cancelled) {
      const selected = pickedImage.assets[0];
      const extension = selected.uri.split('.').pop(); // Get the extension from the URI
      const fileType = selected.type === 'image' ? `image/${extension}` : selected.type;
      setImage({
        uri: selected.uri,
        type: fileType
    });
    }
  };

  const handleUploadImage = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      // Read the selected image as base64

      console.log(image.uri)
      const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });

      const file = {
        type: image.type,
        base64,
      };

      const hardcodedProductId = '6f1d7c4c-db8f-44f5-b157-a131dc30d38f'; // Replace with actual product ID
      const hardcodedProductName = 'Sample Product'; // Replace with actual product name

      // Upload the image
      const res = await uploadProductImage(file, userId, businessId, hardcodedProductId);

      if (res.success) {
        setResult(`✅ Image successfully uploaded: ${res.url}`);
      } else {
        setResult(`❌ Upload failed: ${res.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6 text-center">📸 Upload Product Image Test</Text>

      {/* Button to select an image from the device */}
      <Button title="Select Image" onPress={handleImagePick} />

      {/* Button to upload the selected image */}
      <Button
        title={loading ? 'Uploading...' : 'Upload Image'}
        onPress={handleUploadImage}
        disabled={loading || !image}
      />

      {/* Display the result */}
      {result !== '' && (
        <Text className="mt-6 text-lg text-center text-gray-800">{result}</Text>
      )}
    </View>
  );
}
