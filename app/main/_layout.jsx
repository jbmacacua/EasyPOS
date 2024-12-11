

import { Tabs } from 'expo-router';
import 'react-native-reanimated';

export default function TabsLayout() {
  return (
      <Tabs>
        <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
        <Tabs.Screen name="inventory" options={{ headerShown: false}}/>
        <Tabs.Screen name='sales' options={{ headerShown: false}}/>
        <Tabs.Screen name='profile' options={{ headerShown: false}}/>
      </Tabs>
  );
}
