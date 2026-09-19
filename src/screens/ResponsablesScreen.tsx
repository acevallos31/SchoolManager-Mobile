import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppSelector } from '../store/hooks';
import { getThemeColors } from '../store/slices/themeSlice';

export default function ResponsablesScreen() {
  const responsables = useAppSelector(
    (state) => state.responsables.responsables
  );

  const students = useAppSelector(
    (state) => state.students.students
  );

  const isDark = useAppSelector(
    (state) => state.theme.isDark
  );

  const colors = getThemeColors(isDark);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Responsables
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Responsables registrados
      </Text>

      {responsables.length === 0 && (
        <Text style={{ color: colors.text }}>
          No hay responsables registrados.
        </Text>
      )}

      {responsables.map((responsable) => {
        const alumno = students.find(
          (student) => student.id === responsable.alumnoId
        );

        return (
          <View
            key={responsable.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.name,
                { color: colors.text },
              ]}
            >
              {responsable.nombres} {responsable.apellidos}
            </Text>

            <Text style={{ color: colors.textSecondary }}>
              Parentesco: {responsable.parentesco}
            </Text>

            <Text style={{ color: colors.textSecondary }}>
              Teléfono: {responsable.telefono}
            </Text>

            <Text style={{ color: colors.textSecondary }}>
              Correo: {responsable.correo}
            </Text>

            <Text
              style={[
                styles.student,
                { color: colors.primary },
              ]}
            >
              Alumno:{' '}
              {alumno
                ? `${alumno.nombres} ${alumno.apellidos}`
                : 'No encontrado'}
            </Text>
          </View>
        );
      })}
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

  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  student: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});