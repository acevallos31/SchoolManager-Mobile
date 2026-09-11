import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setAlumnoId,
  setCicloId,
  setGradoId,
  setPeriodoMatriculaId,
  setSeccionId,
} from '../store/slices/enrollmentSlice';

const alumnos = [
  { id: 'alumno-1', nombre: 'Ana López' },
  { id: 'alumno-2', nombre: 'Carlos Martínez' },
];

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

  const periodosDisponibles = periodosMatricula.filter(
    (periodo) => periodo.cicloId === enrollment.cicloId
  );

  const seccionesDisponibles = secciones.filter(
    (seccion) =>
      seccion.cicloId === enrollment.cicloId &&
      seccion.gradoId === enrollment.gradoId
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Matrículas</Text>

      <Text style={styles.label}>Alumno</Text>

      {alumnos.map((alumno) => (
        <Pressable
          key={alumno.id}
          style={styles.option}
          onPress={() => dispatch(setAlumnoId(alumno.id))}
        >
          <Text>{alumno.nombre}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Ciclo escolar</Text>

      {ciclos.map((ciclo) => (
        <Pressable
          key={ciclo.id}
          style={styles.option}
          onPress={() => dispatch(setCicloId(ciclo.id))}
        >
          <Text>{ciclo.nombre}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Período de matrícula</Text>

      {periodosDisponibles.map((periodo) => (
        <Pressable
          key={periodo.id}
          style={styles.option}
          onPress={() =>
            dispatch(setPeriodoMatriculaId(periodo.id))
          }
        >
          <Text>{periodo.nombre}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Grado</Text>

      {grados.map((grado) => (
        <Pressable
          key={grado.id}
          style={styles.option}
          onPress={() => dispatch(setGradoId(grado.id))}
        >
          <Text>{grado.nombre}</Text>
        </Pressable>
      ))}

      <Text style={styles.label}>Sección</Text>

      {seccionesDisponibles.map((seccion) => (
        <Pressable
          key={seccion.id}
          style={styles.option}
          onPress={() => dispatch(setSeccionId(seccion.id))}
        >
          <Text>{seccion.nombre}</Text>
        </Pressable>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Selección actual</Text>

        <Text>
          Alumno: {enrollment.alumnoId || 'Sin seleccionar'}
        </Text>

        <Text>
          Ciclo: {enrollment.cicloId || 'Sin seleccionar'}
        </Text>

        <Text>
          Período:{' '}
          {enrollment.periodoMatriculaId || 'Sin seleccionar'}
        </Text>

        <Text>
          Grado: {enrollment.gradoId || 'Sin seleccionar'}
        </Text>

        <Text>
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
    borderColor: '#999',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  summary: {
    marginTop: 25,
    padding: 15,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});