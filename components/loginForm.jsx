import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = ({ email, setEmail, password, setPassword, rememberPassword, setRememberPassword, setRole }) => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initializeStorage = async () => {
            try {
                // Check if credentials exist in AsyncStorage, otherwise set defaults
                const storedEmail = await AsyncStorage.getItem('email');
                const storedPassword = await AsyncStorage.getItem('password');
                const storedRole = await AsyncStorage.getItem('role');

                if (!storedEmail || !storedPassword || !storedRole) {
                    await AsyncStorage.setItem('email', 'admin');
                    await AsyncStorage.setItem('password', 'admin');
                    await AsyncStorage.setItem('role', 'admin');

                    await AsyncStorage.setItem('email_employee', 'employee');
                    await AsyncStorage.setItem('password_employee', 'employee');
                    await AsyncStorage.setItem('role_employee', 'employee');
                }
            } catch (error) {
                console.error("Error initializing storage:", error);
            }
        };

        initializeStorage();
    }, []);

    const handleLogin = async () => {
        try {
            // Fetch stored credentials
            const adminEmail = await AsyncStorage.getItem('email');
            const adminPassword = await AsyncStorage.getItem('password');
            const adminRole = await AsyncStorage.getItem('role');
    
            const employeeEmail = await AsyncStorage.getItem('email_employee');
            const employeePassword = await AsyncStorage.getItem('password_employee');
            const employeeRole = await AsyncStorage.getItem('role_employee');
    
            if ((email === adminEmail && password === adminPassword) || (email === employeeEmail && password === employeePassword)) {
                const userRole = email === adminEmail ? adminRole : employeeRole;
                setRole(userRole);
                
                console.log("User Role:", userRole); 
                if (rememberPassword) {
                    await AsyncStorage.setItem('email', email);
                    await AsyncStorage.setItem('password', password);
                    await AsyncStorage.setItem('role', userRole);
                }
    
                // Navigate based on role
                if (userRole === 'admin') {
                    router.push('/main/dashboard');
                } else if (userRole === 'employee') {
                    router.push('/main/sales');
                }
            } else {
                Alert.alert('Login Failed', 'Invalid username or password.');
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
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
                    <TouchableOpacity className="bg-[#3C80B4] py-3 rounded-lg w-60 mx-auto"
                        onPress={handleLogin}>
                        <Text className="text-white text-center text-lg font-semibold">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;
