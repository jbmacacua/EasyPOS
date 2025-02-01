import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import LoginForm from '@components/loginForm';
import RegisterForm from '@components/registerForm'; // Assuming you have a register form
import LoginHeader from '@components/loginHeader';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 


  return (
    <View className="bg-[#3F89C1] pb-4 flex-1">
      <LoginHeader />  
      {/* Login/Register Tabs */}
      <View className="flex-row justify-center py-12 bg-white rounded-t-[65px]">
        <TouchableOpacity
          className="px-4"
          onPress={() => setIsLogin(true)} // Toggle to login form
        >
          <Text className={`text-xl ${isLogin ? 'font-semibold text-[#3C80B4]' : 'text-gray-500'}`}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4"
          onPress={() => setIsLogin(false)} // Toggle to register form
        >
          <Text className={`text-xl ${!isLogin ? 'font-semibold text-[#3C80B4]' : 'text-gray-500'}`}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Content below the tabs */}
      <View className="h-full bg-white">
        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberPassword={rememberPassword}
            setRememberPassword={setRememberPassword}
          />
        ) : (
          <RegisterForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberPassword={rememberPassword}
            setRememberPassword={setRememberPassword}
          />
        )}
      </View>
    </View>
  );
};

export default Login;
