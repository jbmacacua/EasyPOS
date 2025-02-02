import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Header from "@components/header";
import { useRouter } from "expo-router";

export default function AccountSettings() {
    const router = useRouter();
    const [editable, setEditable] = useState(false);
    const [image, setImage] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        address: "",
    });

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
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View className="bg-[#3F89C1] flex-1">
            <Header />
            <View className="flex-1 bg-white rounded-t-[65px] px-7 py-6">
                {/* Edit Icon */}
                <TouchableOpacity className="absolute top-6 right-6 mr-4 mt-2" onPress={handleEdit}>
                    <Feather name={editable ? "x" : "edit"} size={24} color="black" />
                </TouchableOpacity>

                {/* Profile Image */}
                <TouchableOpacity onPress={pickImage} disabled={!editable} className="self-center mb-4">
                    {image ? (
                        <Image source={{ uri: image }} className="w-20 h-20 rounded-full" />
                    ) : (
                        <View className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center">
                            <Feather name="user" size={32} color="black" />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View>
                    <View className="flex-row justify-between">
                        <View className="w-[48%]">
                            <Text className="font-semibold mb-1">First Name:</Text>
                            <TextInput
                                className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                                editable={editable}
                                value={form.firstName}
                                onChangeText={(text) => handleInputChange("firstName", text)}
                                placeholder="Nicolas"
                            />
                        </View>
                        <View className="w-[48%]">
                            <Text className="font-semibold mb-1">Last Name:</Text>
                            <TextInput
                                className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                                editable={editable}
                                value={form.lastName}
                                onChangeText={(text) => handleInputChange("lastName", text)}
                                placeholder="Fabillar"
                            />
                        </View>
                    </View>

                    <Text className="font-semibold mt-4 mb-1">Contact Number:</Text>
                    <TextInput
                        className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                        editable={editable}
                        value={form.contactNumber}
                        onChangeText={(text) => handleInputChange("contactNumber", text)}
                        placeholder="09222124534"
                    />

                    <Text className="font-semibold mt-4 mb-1">Email:</Text>
                    <TextInput
                        className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                        editable={editable}
                        value={form.email}
                        onChangeText={(text) => handleInputChange("email", text)}
                        placeholder="Nicolas@email.com"
                    />

                    <Text className="font-semibold mt-4 mb-1">Address:</Text>
                    <TextInput
                        className="bg-gray-200 px-3 py-2 rounded-lg mt-1"
                        editable={editable}
                        value={form.address}
                        onChangeText={(text) => handleInputChange("address", text)}
                        placeholder="Complete Address"
                        multiline
                    />
                </View>

                {/* Buttons Wrapper - Moves Buttons to Bottom */}
                <View className="mt-auto">
                    {editable && (
                        <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl mb-4" onPress={() => setEditable(false)}>
                            <Text className="text-white text-center font-semibold text-lg">Save</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl" onPress={() => router.push("/main/profile")}>
                        <Text className="text-white text-center font-semibold text-lg">Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
