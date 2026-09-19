import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/userSlice';
import { loginSchoolManager } from '../services/authService';

type Props = {
  navigation: any;
};

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const normalized = value.trim();
    return normalized.includes('@') && normalized.includes('.');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const { accessToken, email: sessionEmail, perfil } =
        await loginSchoolManager(email, password);

      const roles =
        perfil.roles?.length > 0
          ? perfil.roles
          : perfil.ambitoGlobal?.roles || [];

      dispatch(
        setUser({
          name: perfil.nombreCompleto || 'Usuario SchoolManager',
          email: sessionEmail,
          role: roles[0] || 'Usuario',
          accessToken,
        })
      );

      navigation.replace('MainTabs');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible iniciar sesión.';

      Alert.alert('No se pudo iniciar sesión', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SchoolManager</Text>

      <Text style={styles.subtitle}>Iniciar sesión</Text>

      <CustomInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        type="email"
      />

      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        type="password"
      />

      <CustomButton
        title={loading ? 'Conectando...' : 'Ingresar'}
        onPress={handleLogin}
        variant="primary"
        disabled={loading}
      />

      <Text style={styles.connectionHint}>
        Conectado a SchoolManager API
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 30,
  },

  connectionHint: {
    marginTop: 16,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 12,
  },
});
