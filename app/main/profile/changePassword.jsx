import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useMemo } from 'react';
import Header from "@components/header";
import { useRouter } from "expo-router";
import { changePassword } from "@api/accounts";
import { useSession } from "@context/auth";

export default function ChangePassword() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { session } = useSession();

    const parsedSession = useMemo(() => {
        try {
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.warn("Failed to parse session:", error);
            return null;
        }
    }, [session]);

    const handleSave = async () => {
        setLoading(true);
        const userId = parsedSession?.user?.id;

        const res = await changePassword(currentPassword, newPassword, confirmPassword, userId);

        setLoading(false);

        if (res.success) {
            Alert.alert("Success", "Password changed successfully.");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            router.push("/main/profile");
        } else {
            Alert.alert("Error", res.error || "Something went wrong.");
        }
    };

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
                    <TouchableOpacity
                        className="bg-[#007DA5] p-4 rounded-2xl mb-4 flex items-center justify-center"
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-center">Save</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-[#007DA5] py-3 rounded-2xl"
                        onPress={() => router.push("/main/profile")}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-semibold text-lg">Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
