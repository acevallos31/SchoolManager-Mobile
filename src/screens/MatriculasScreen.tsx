import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getThemeColors } from '../store/slices/themeSlice';

import {
  setAlumnoId,
  setCicloId,
  setGradoId,
  setPeriodoMatriculaId,
  setSeccionId,
} from '../store/slices/enrollmentSlice';

const ciclos = [
  { id: 'ciclo-2026', nombre: '2026' },
  { id: 'ciclo-2027', nombre: '2027' },
];

const periodosMatricula = [
  {
    id: 'periodo-1',
    cicloId: 'ciclo-2026',
    nombre: 'Matrícula ordinaria',
  },
  {
    id: 'periodo-2',
    cicloId: 'ciclo-2026',
    nombre: 'Matrícula extraordinaria',
  },
  {
    id: 'periodo-3',
    cicloId: 'ciclo-2027',
    nombre: 'Matrícula ordinaria',
  },
];

const grados = [
  { id: 'grado-1', nombre: 'Primero' },
  { id: 'grado-2', nombre: 'Segundo' },
  { id: 'grado-3', nombre: 'Tercero' },
];

const secciones = [
  {
    id: 'seccion-1',
    cicloId: 'ciclo-2026',
    gradoId: 'grado-1',
    nombre: 'Sección A',
  },
  {
    id: 'seccion-2',
    cicloId: 'ciclo-2026',
    gradoId: 'grado-1',
    nombre: 'Sección B',
  },
  {
    id: 'seccion-3',
    cicloId: 'ciclo-2026',
    gradoId: 'grado-2',
    nombre: 'Sección A',
  },
  {
    id: 'seccion-4',
    cicloId: 'ciclo-2027',
    gradoId: 'grado-1',
    nombre: 'Sección A',
  },
];

export default function MatriculasScreen() {
  const dispatch = useAppDispatch();

  const enrollment = useAppSelector(
    (state) => state.enrollment
  );

  const alumnos = useAppSelector(
    (state) => state.students.students
  );

  const isDark = useAppSelector(
    (state) => state.theme.isDark
  );

  const colors = getThemeColors(isDark);

  const periodosDisponibles = periodosMatricula.filter(
    (periodo) => periodo.cicloId === enrollment.cicloId
  );

  const seccionesDisponibles = secciones.filter(
    (seccion) =>
      seccion.cicloId === enrollment.cicloId &&
      seccion.gradoId === enrollment.gradoId
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Matrículas
      </Text>

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Alumno
      </Text>

      {alumnos.length === 0 && (
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary },
          ]}
        >
          No hay alumnos registrados.
        </Text>
      )}

      {alumnos.map((alumno) => (
        <Pressable
          key={alumno.id}
          style={[
            styles.option,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() => dispatch(setAlumnoId(alumno.id))}
        >
          <Text style={{ color: colors.text }}>
            {alumno.nombres} {alumno.apellidos}
          </Text>
        </Pressable>
      ))}

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Ciclo escolar
      </Text>

      {ciclos.map((ciclo) => (
        <Pressable
          key={ciclo.id}
          style={[
            styles.option,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() => dispatch(setCicloId(ciclo.id))}
        >
          <Text style={{ color: colors.text }}>
            {ciclo.nombre}
          </Text>
        </Pressable>
      ))}

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Período de matrícula
      </Text>

      {periodosDisponibles.map((periodo) => (
        <Pressable
          key={periodo.id}
          style={[
            styles.option,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() =>
            dispatch(setPeriodoMatriculaId(periodo.id))
          }
        >
          <Text style={{ color: colors.text }}>
            {periodo.nombre}
          </Text>
        </Pressable>
      ))}

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Grado
      </Text>

      {grados.map((grado) => (
        <Pressable
          key={grado.id}
          style={[
            styles.option,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() => dispatch(setGradoId(grado.id))}
        >
          <Text style={{ color: colors.text }}>
            {grado.nombre}
          </Text>
        </Pressable>
      ))}

      <Text
        style={[
          styles.label,
          { color: colors.text },
        ]}
      >
        Sección
      </Text>

      {seccionesDisponibles.map((seccion) => (
        <Pressable
          key={seccion.id}
          style={[
            styles.option,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() => dispatch(setSeccionId(seccion.id))}
        >
          <Text style={{ color: colors.text }}>
            {seccion.nombre}
          </Text>
        </Pressable>
      ))}

      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.summaryTitle,
            { color: colors.text },
          ]}
        >
          Selección actual
        </Text>

        <Text style={{ color: colors.text }}>
          Alumno: {enrollment.alumnoId || 'Sin seleccionar'}
        </Text>

        <Text style={{ color: colors.text }}>
          Ciclo: {enrollment.cicloId || 'Sin seleccionar'}
        </Text>

        <Text style={{ color: colors.text }}>
          Período:{' '}
          {enrollment.periodoMatriculaId || 'Sin seleccionar'}
        </Text>

        <Text style={{ color: colors.text }}>
          Grado: {enrollment.gradoId || 'Sin seleccionar'}
        </Text>

        <Text style={{ color: colors.text }}>
          Sección: {enrollment.seccionId || 'Sin seleccionar'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },

  option: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },

  emptyText: {
    marginBottom: 8,
  },

  summary: {
    marginTop: 25,
    padding: 15,
    borderWidth: 1,
    borderRadius: 6,
  },

  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});