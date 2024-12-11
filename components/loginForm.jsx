import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';

const LoginForm = ({ email, setEmail, password, setPassword, rememberPassword, setRememberPassword }) => {
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const router = useRouter();

    return (
        <View>
            
            {/* Input Fields */}
            <View className="px-8 mt-4 py-7">
                <TextInput
                    className="border-b border-gray-300 pb-2 mb-4 text-lg"
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                />
                <View className="flex-row items-center border-b border-gray-300 mb-4">
                    <TextInput
                        className="flex-1 text-lg"
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? "eye-slash" : "eye"}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                {/* Remember Password and Forget Password */}
                <View className="flex-row items-center justify-between mb-6 pt-4 px-3">
                    <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
                        <View className="flex-row items-center pr-14">
                            <View className="w-4 h-4 mr-2 border rounded-sm items-center justify-center">
                                {rememberPassword && (
                                    <Icon name="check" size={12} color="#4CAF50" />
                                )}
                            </View>
                            <Text className="text-gray-500 text-base">Remember password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="text-blue-500 text-base">Forget password</Text>
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <View className="pt-12">
                    <TouchableOpacity className="bg-[#3C80B4] py-3 rounded-lg w-60 mx-auto"
                        onPress={() => router.push('/main/dashboard')} >
                        <Text className="text-white text-center text-lg font-semibold">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;
