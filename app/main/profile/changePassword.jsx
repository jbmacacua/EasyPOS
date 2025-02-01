import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Header from "@components/header";
import { useRouter } from "expo-router";

export default function ChangePassword() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <View className="bg-[#3F89C1] flex-1">
            <Header />
            <View className="flex-1 bg-white rounded-t-[65px] px-7 py-6">
                <View className="mt-8">
                    <Text className="text-lg font-bold mb-6">Change Password</Text>

                    <Text className="font-medium mb-1">Current Password</Text>
                    <TextInput
                        className="bg-gray-200 p-3 rounded-lg mb-3"
                        placeholder="Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />

                    <Text className="font-medium mb-1">New Password</Text>
                    <TextInput
                        className="bg-gray-200 p-3 rounded-lg mb-3"
                        placeholder="Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <Text className="font-medium mb-1">Confirm Password</Text>
                    <TextInput
                        className="bg-gray-200 p-3 rounded-lg mb-5"
                        placeholder="Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>


                <View className="mt-auto">
                    <TouchableOpacity className="bg-[#007DA5] p-4 rounded-2xl mb-4">
                        <Text className="text-white font-bold text-center">Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-[#007DA5] py-3 rounded-2xl" onPress={() => router.push("/main/profile")}>
                        <Text className="text-white text-center font-semibold text-lg">Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
