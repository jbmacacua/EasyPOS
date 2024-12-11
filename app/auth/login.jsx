import React, { useState } from 'react';
import { View } from 'react-native';
import LoginForm from '@components/loginForm';
import LoginHeader from '../../components/loginHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  return (
    <View className="flex-1 bg-[#3C80B4]">
      {/* Header */}
      <LoginHeader />
      {/* Content Below the Header */}
      <View className="flex-1 bg-white">
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberPassword={rememberPassword}
          setRememberPassword={setRememberPassword}
        />
      </View>
    </View>
  );
};

export default Login;
