import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../contexts/ThemeContext';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: any;
  name?: string;
  email?: string;
  role?: string;
  school?: string;
};

export default function ProfileScreen({
  navigation,
  name,
  email,
  role,
  school,
}: Props) {
  const { colors } = useTheme();

  const handleLogout = () => {
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
   <ScrollView
    style={[
    styles.container,
    { backgroundColor: colors.background },
     ]}
    >
    <Text
    style={[
    styles.title,
      { color: colors.text },
        ]}
      >
     Perfil
    </Text>

    <Text
    style={[
    styles.subtitle,
    { color: colors.textSecondary },
        ]}
      >
    Información del usuario
    </Text>

    <View
    style={[
    styles.profileCard,
    {
    backgroundColor: colors.cardBackground,
    borderColor: colors.cardBorder,
    },
    ]}
    >
   <Ionicons
    name="person-circle"
    size={90}
    color={colors.primary}
    />

  <Text
  style={[
     styles.name,
    { color: colors.text },
  ]}
  >
  {name ?? 'Nombre no disponible'}
  </Text>

  <Text
  style={[
    styles.label,
    { color: colors.text },
  ]}
>
  Correo electrónico
</Text>

<View
  style={[
    styles.infoBox,
    {
      backgroundColor: colors.background,
      borderColor: colors.cardBorder,
    },
  ]}
>
  <Text
    style={[
      styles.infoText,
      { color: colors.text },
    ]}
  >
    {email ?? 'No disponible'}
  </Text>
</View>

<Text
  style={[
    styles.label,
    { color: colors.text },
  ]}
>
  Rol
</Text>

<View
  style={[
    styles.infoBox,
    {
      backgroundColor: colors.background,
      borderColor: colors.cardBorder,
    },
  ]}
>
  <Text
    style={[
      styles.infoText,
      { color: colors.text },
    ]}
  >
    {role ?? 'No disponible'}
  </Text>
</View>

<Text
  style={[
    styles.label,
    { color: colors.text },
  ]}
>
  Centro educativo
</Text>

<View
  style={[
    styles.infoBox,
    {
      backgroundColor: colors.background,
      borderColor: colors.cardBorder,
    },
  ]}
>
  <Text
    style={[
      styles.infoText,
      { color: colors.text },
    ]}
  >
    {school ?? 'No disponible'}
  </Text>
</View>
  
 </View>
    <CustomButton
     title="Cerrar sesión"
    onPress={handleLogout}
    variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  profileCard: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },

    label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    },

  infoText: {
    fontSize: 16,
    marginTop: 4,
      textAlign: 'center',
  },

  infoBox: {
  width: '100%',
  padding: 15,
  borderRadius: 9,
  borderWidth: 1,
  marginTop: 6,
},
});