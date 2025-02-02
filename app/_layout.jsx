import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authContext'; // Import AuthProvider

const AppLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="main" />
        <Stack.Screen name="settings" />
      </Stack>
    </AuthProvider>
  );
};

export default AppLayout;
