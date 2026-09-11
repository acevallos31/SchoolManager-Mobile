import { StyleSheet, Text, View } from 'react-native';

export default function MatriculasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matrículas</Text>

      <Text>Alumno</Text>
      <Text>Ciclo escolar</Text>
      <Text>Período de matrícula</Text>
      <Text>Grado</Text>
      <Text>Sección</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});