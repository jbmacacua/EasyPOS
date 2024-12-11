import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold text-gray-800">This screen doesn't exist.</Text>
        <Link href="main/dashboard" className="mt-4 py-3 px-5 bg-blue-500 rounded-md">
          <Text className="text-white text-lg font-medium">Go to dashboard!</Text>
        </Link>
      </View>
    </>
  );
}