import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import StudentsScreen from '../screens/StudentsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MatriculasScreen from '../screens/MatriculasScreen';

import { useAppSelector } from '../store/hooks';
import { getThemeColors } from '../store/slices/themeSlice';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const isDark = useAppSelector(
    (state) => state.theme.isDark
  );

  const colors = getThemeColors(isDark);

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
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

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
        name="Matrículas"
        component={MatriculasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="school"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

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