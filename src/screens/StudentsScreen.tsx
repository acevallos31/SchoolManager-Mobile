import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useTheme } from '../contexts/ThemeContext';
import CustomInput from '../components/CustomInput';

export default function StudentsScreen() {
  const { colors } = useTheme();

  const [RNE, setRNE] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [direccion, setDireccion] = useState('');

  const [responsableNombre, setResponsableNombre] = useState('');
  const [responsableApellido, setResponsableApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [parentesco, setParentesco] = useState('');

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
        Alumnos
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Registro de alumnos
      </Text>

      <View
        style={[
          styles.formCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.formTitle,
            { color: colors.text },
          ]}
        >
          Datos del alumno
        </Text>

        <CustomInput
          label="RNE"
          placeholder="Ingrese el RNE del alumno"
          value={RNE}
          onChangeText={setRNE}
        />

        <CustomInput
          label="Nombre"
          placeholder="Ingrese el nombre del alumno"
          value={nombre}
          onChangeText={setNombre}
        />

        <CustomInput
          label="Apellido"
          placeholder="Ingrese el apellido del alumno"
          value={apellido}
          onChangeText={setApellido}
        />

        <CustomInput
          label="Fecha de nacimiento"
          placeholder="DD/MM/AAAA"
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
        />

        <CustomInput
          label="Dirección"
          placeholder="Ingrese la dirección del alumno"
          value={direccion}
          onChangeText={setDireccion}
        />

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Datos del responsable
        </Text>

        <CustomInput
          label="Nombre del responsable"
          placeholder="Ingrese el nombre"
          value={responsableNombre}
          onChangeText={setResponsableNombre}
        />

        <CustomInput
          label="Apellido del responsable"
          placeholder="Ingrese el apellido"
          value={responsableApellido}
          onChangeText={setResponsableApellido}
        />

        <CustomInput
          label="Teléfono"
          placeholder="Ingrese el teléfono"
          value={telefono}
          onChangeText={setTelefono}
          type="number"
        />

        <CustomInput
          label="Correo electrónico"
          placeholder="Ingrese el correo"
          value={correo}
          onChangeText={setCorreo}
        />

        <CustomInput
          label="Parentesco"
          placeholder="Ej. Madre, Padre, Tutor"
          value={parentesco}
          onChangeText={setParentesco}
        />
      </View>
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

  formCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
});