import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import LoginForm from '@login/loginForm';
import RegisterForm from '@register/registerForm';
import LoginHeader from '@login/loginHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(null); 

  return (
    <View className="flex-1 bg-[#3F89C1] pb-4">
      <LoginHeader />

      {/* Login/Register Tabs */}
      <View className="flex-row justify-center py-10 bg-white rounded-t-[50px]">
        {['Login', 'Register'].map((tab, index) => {
          const isActive = (isLogin && tab === 'Login') || (!isLogin && tab === 'Register');
          return (
            <TouchableOpacity
              key={tab}
              className="px-6"
              onPress={() => setIsLogin(index === 0)}
            >
              <Text className={`text-xl ${isActive ? 'font-semibold text-[#3C80B4]' : 'text-gray-500'}`}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Login/Register Form */}
      <View className="flex-1 bg-white px-6 pt-6">
        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberPassword={rememberPassword}
            setRememberPassword={setRememberPassword}
            setRole={setRole} // Pass setRole to LoginForm
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
