import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
  const { login, logout, retry, error, canRetry } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (submitting) return;
    if (!email.trim() || !password) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Introduce un correo electrónico válido.');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await login(email, password);
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>SchoolManager</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {canRetry ? 'Acceso pendiente de validación' : 'Iniciar sesión'}
      </Text>
      {formError || error ? <Text accessibilityRole="alert" style={styles.error}>{formError || error}</Text> : null}
      {canRetry ? (
        <>
          <CustomButton title="Reintentar validación" onPress={() => { void retry(); }} />
          <CustomButton title="Cerrar sesión" onPress={() => { void logout(); }} variant="secondary" />
        </>
      ) : (
        <>
          <CustomInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} type="email" />
          <CustomInput placeholder="Contraseña" value={password} onChangeText={setPassword} type="password" />
          <CustomButton title={submitting ? 'Ingresando…' : 'Ingresar'} onPress={handleLogin} disabled={submitting} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 30 },
  error: { color: '#B91C1C', marginBottom: 16, textAlign: 'center' },
});
