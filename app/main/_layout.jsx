import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import '@css';
import { useSession } from '@context/auth'; // <- Use this instead of useAuth
import { useRouter } from 'expo-router'; // Import the useRouter hook

export default function TabsLayout() {
  const { userRole } = useSession(); // Get user role from global context
  const router = useRouter(); // Use the router hook

  useEffect(() => {
    // Programmatically navigate to the correct tab based on userRole
    if (userRole !== 'sales') {
      router.replace('/main/dashboard'); // Navigate to 'dashboard' for non-sales roles
    }
  }, [userRole, router]);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: { height: 65, backgroundColor: '#3C80B4', paddingTop: 12 },
        tabBarActiveTintColor: '#3C80B4',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'dashboard':
              iconName = 'home';
              break;
            case 'inventory':
              return (
                <View
                  className={`w-12 h-12 rounded-full ${focused ? 'bg-white' : 'bg-transparent'} flex items-center justify-center`}
                >
                  <Octicons name="checklist" size={24} color={color} />
                </View>
              );
            case 'sales':
              iconName = 'shopping-cart';
              break;
            case 'profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }
          return (
            <View
              className={`w-12 h-12 rounded-full ${focused ? 'bg-white' : 'bg-transparent'} flex items-center justify-center`}
            >
              <MaterialIcons name={iconName} size={28} color={color} />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          href: userRole === 'sales' ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="sales"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
