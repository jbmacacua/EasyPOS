import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import { useSession } from '../context/auth'; 
import { useStorageState } from '@hooks/useStorageState'; 

const LoginForm = ({ email, setEmail, password, setPassword, rememberPassword, setRememberPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const router = useRouter();
    const { signIn, session, userRole } = useSession(); 

    const [[loading, storedCredentials], setStoredCredentials] = useStorageState('credentials');

    // Load stored credentials when ready
    useEffect(() => {
        if (!loading && storedCredentials) {
            try {
                const parsed = JSON.parse(storedCredentials);
                const { email: storedEmail, password: storedPassword } = parsed;
                setEmail(storedEmail);
                setPassword(storedPassword);
                setRememberPassword(true); 
            } catch (err) {
                console.error("Failed to parse stored credentials:", err);
                setStoredCredentials(null);
            }
        }
    }, [loading, storedCredentials]);

    useEffect(() => {
        if (userRole) {
            if (userRole === "owner") {
                router.push('/main/dashboard');
            } else {
                router.push('/main/sales');
            }
        }
    }, [userRole]); 

    // Handle login
    const handleLogin = async (email, password, remember) => {

        if (!email || !password){
            return Alert.alert('Login Failed','Email and Password cannot be null.');
        }

        setIsLoading(true); // Start loading animation

        const success = await signIn({ email, password });

        setIsLoading(false); // Stop loading animation

        if (success) {
            if (remember) {
                setStoredCredentials(JSON.stringify({ email, password }));
            } else {
                setStoredCredentials(null);
            }
        }

        return;
    };

    return (
        <View>
            <View className="px-8 mt-4 py-7">
                <TextInput
                    className="border-b border-gray-300 pb-2 mb-4 text-lg"
                    placeholder="Username"
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

                <View className="pt-12">
                    <TouchableOpacity
                        className="bg-[#3C80B4] py-3 rounded-lg w-60 mx-auto"
                        onPress={() => handleLogin(email, password, rememberPassword)}
                        disabled={isLoading} // Disable button while loading
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isLoading && (
                    <View className="flex items-center mt-4">
                        <ActivityIndicator size="large" color="#3C80B4" />
                    </View>
                )}
            </View>
        </View>
    );
};

export default LoginForm;
