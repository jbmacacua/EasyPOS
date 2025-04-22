import { useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "@ui/header";
import { useRouter } from "expo-router";
import { useSession } from "@context/auth";
import { editProfile, getUserDetails, uploadProfileImage } from "@api/accounts";
import * as FileSystem from "expo-file-system";

export default function AccountSettings() {
  const router = useRouter();
  const { session } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  useEffect(() => {
    if (!parsedSession) {
      router.replace("/");
    }
  }, [parsedSession]);

  const [editable, setEditable] = useState(false);
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null);
  const [newImagePicked, setNewImagePicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (!parsedSession?.user?.id) {
      router.replace("/auth/login");
      return;
    }

    const loadUserDetails = async () => {
      setLoading(true);
      const { success, userDetails, error } = await getUserDetails(parsedSession.user.id);
      setLoading(false);

      if (!success || !userDetails) {
        console.warn("Could not load user details:", error);
        return;
      }

      setForm({
        firstName: userDetails.first_name || "",
        lastName: userDetails.last_name || "",
        contactNumber: userDetails.contact_number || "",
        email: userDetails.email || parsedSession.user.email || "",
        address: userDetails.address || "",
      });

      if (userDetails.profile_image) {
        setImage(userDetails.profile_image);
        setInitialImage(userDetails.profile_image);
      }
    };

    loadUserDetails();
  }, [parsedSession, router]);

  const handleEdit = () => setEditable(!editable);

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      const extension = selected.uri.split('.').pop();
      const fileType = selected.type === 'image' ? `image/${extension}` : selected.type;

      setImage({
        uri: selected.uri,
        type: fileType
      });
      setNewImagePicked(true);
    }
  };

  const handleSave = async () => {
    if (!parsedSession?.user?.id) return;

    setLoading(true);

    const profileUpdate = await editProfile(
      form.firstName,
      form.lastName,
      form.contactNumber,
      form.address,
      parsedSession.user.id
    );

    if (!profileUpdate.success) {
      setLoading(false);
      Alert.alert("Error", "Failed to update profile.");
      return;
    }

    if (image && newImagePicked) {
      try {
        const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });

        const file = {
          type: image.type,
          base64,
        };

        const imgUpload = await uploadProfileImage(file, parsedSession.user.id);
        if (!imgUpload.success) {
          setLoading(false);
          Alert.alert("Error", "Failed to upload profile image.");
          return;
        }
        setInitialImage(imgUpload.imageUrl);
        setNewImagePicked(false);
      } catch (err) {
        setLoading(false);
        console.error("Image upload error:", err);
        Alert.alert("Error", "Something went wrong during image upload.");
        return;
      }
    }

    setLoading(false);
    Alert.alert("Success", "Profile updated!");
    setEditable(false);
  };

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-7 py-6">
        <TouchableOpacity className="absolute top-6 right-6 mr-4 mt-2" onPress={handleEdit}>
          <Feather name={editable ? "x" : "edit"} size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage} disabled={!editable} className="self-center mb-4">
          {image ? (
            <Image source={{ uri: image.uri || image }} className="w-20 h-20 rounded-full" />
          ) : (
            <View className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center">
              <Feather name="user" size={32} color="black" />
            </View>
          )}
        </TouchableOpacity>

        <View>
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Text className="font-semibold mb-1">First Name:</Text>
              <TextInput
                className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                editable={editable}
                value={form.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
                placeholder="First Name"
              />
            </View>
            <View className="w-[48%]">
              <Text className="font-semibold mb-1">Last Name:</Text>
              <TextInput
                className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                editable={editable}
                value={form.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
                placeholder="Last Name"
              />
            </View>
          </View>

          <Text className="font-semibold mt-4 mb-1">Contact Number:</Text>
          <TextInput
            className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
            editable={editable}
            value={form.contactNumber}
            onChangeText={(text) => handleInputChange("contactNumber", text)}
            placeholder="Contact Number"
          />

          <Text className="font-semibold mt-4 mb-1">Email:</Text>
          <TextInput
            className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
            editable={false}
            value={form.email}
            placeholder="Email Address"
          />

          <Text className="font-semibold mt-4 mb-1">Address:</Text>
          <TextInput
            className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
            editable={editable}
            value={form.address}
            onChangeText={(text) => handleInputChange("address", text)}
            placeholder="Home Address"
            multiline
          />
        </View>

        <View className="mt-auto">
          {editable && (
            <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl mb-4" onPress={handleSave}>
              <Text className="text-white text-center font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl" onPress={() => router.push("/main/profile")}>
            <Text className="text-white text-center font-semibold text-lg">Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Spinner Modal */}
      <Modal transparent animationType="fade" visible={loading}>
        <View className="flex-1 justify-center items-center ">
          <ActivityIndicator size="large" color="#3C80B4" />
        </View>
      </Modal>
    </View>
  );
}