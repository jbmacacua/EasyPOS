

import { Stack } from 'expo-router';
import 'react-native-reanimated';
import "../global.css";

export default function RootLayout() {
  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="main"/>
        <Stack.Screen name="+not-found"/>
      </Stack>
  );
}
