import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'; // Add ActivityIndicator
import Icon from 'react-native-vector-icons/MaterialIcons'; // For eye icon
import { useSession } from '@context/auth';

const RegisterForm = () => {
    const { signUp } = useSession();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const handleRegister = async (firstName, lastName, contactNumber, address, email, password, confirmPassword) => {
        try {
            // Simple field validation
            if (!firstName || !lastName || !contactNumber || !address || !email || !password || !confirmPassword) {
                Alert.alert('All fields are required');
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Passwords do not match');
                return;
            }

            setLoading(true); // Start loading

            await signUp(firstName, lastName, contactNumber, address, email, password);

            setLoading(false); // End loading

            // Handle success (e.g., navigate to a different screen or show a success message)
        } catch (err) {
            console.error('Registration error:', err);
            setLoading(false); // End loading in case of error
        }
    };

    return (
        <View className="flex-1 bg-white px-6 py-0">

            {/* Form Fields */}
            <View>
                {/* Last Name */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                {/* Last Name */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                {/* Address */}
                <View className="mb-4">
                    <TextInput
                        className="border-b border-[#3C80B4] pb-2 text-lg"
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
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

            {/* Submit Button */}
            <View className="mt-6">
                <TouchableOpacity
                    className="bg-[#3C80B4] py-3 rounded-lg mx-auto w-60"
                    onPress={() => handleRegister(firstName, lastName, contactNumber, address, email, password, confirmPassword)}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" /> // Show loading spinner
                    ) : (
                        <Text className="text-white text-center text-lg font-semibold">Submit</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterForm;
