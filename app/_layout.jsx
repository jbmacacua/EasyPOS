import React from 'react';
import { Stack } from 'expo-router';
import { SessionProvider } from '../context/auth';

const AppLayout = () => {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="main" />
        <Stack.Screen name="settings" />
      </Stack>
    </SessionProvider>
  );
};

export default AppLayout;
