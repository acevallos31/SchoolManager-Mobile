import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import StudentsScreen from '../screens/StudentsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';


import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }: any) {
  const { colors } = useTheme();
  const { email } = route.params;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.text,

        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
  name="Inicio"
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons
        name="home"
        size={size}
        color={color}
      />
    ),
  }}
>
  {() => <HomeScreen email={email} />}
</Tab.Screen>

      <Tab.Screen
        name="Alumnos"
        component={StudentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
  name="Perfil"
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
  }}
>
  {({ navigation }) => (
    <ProfileScreen
      navigation={navigation}
      email={email}
    />
  )}
</Tab.Screen>

      <Tab.Screen
        name="Configuración"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}