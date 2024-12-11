import React from 'react';
import { View } from 'react-native';
import RegisterForm from '@components/registerForm';
import LoginHeader from '../../components/loginHeader';

const Register = () => {
  return (
    <View className="flex-1 bg-[#3C80B4]">
      {/* Header */}
      <LoginHeader />
      {/* Content Below the Header */}
      <View className="flex-1 bg-white">
        <RegisterForm />
      </View>
    </View>
  );
};

export default Register;
