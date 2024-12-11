import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For eye icon

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <View className="flex-1 bg-white px-6 py-8">

            {/* Form Fields */}
            <View>
                {/* Name */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Contact Number */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        keyboardType="phone-pad"
                    />            
                </View>

                {/* Email Address */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />      
                </View>

                {/* Password */}
                <View className="mb-4">
                    <View className="flex-row items-center border-b border-[#3C80B4]">
                        <TextInput
                            className="flex-1 pb-2 text-lg"
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View className="mb-4">
                    <View className="flex-row items-center border-b border-[#3C80B4]">
                        <TextInput
                            className="flex-1 pb-2 text-lg"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={20} color="gray" />
                        </TouchableOpacity>
                    </View>          
                </View>
            </View>

            {/* Next Button */}
            <View className="mt-6">
                <TouchableOpacity className="bg-[#3C80B4] py-3 rounded-lg mx-auto w-60">
                    <Text className="text-white text-center text-lg font-semibold">Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterForm;
