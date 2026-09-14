import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Student = {
  id: string;
  institucionId: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  fechaNacimiento: string | null;
  rne: string | null;
  codigoInterno: string | null;
};
export type StudentsState = {
  students: Student[];
};

const initialState: StudentsState = {
  students: [],
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },

    removeStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(
        (student) => student.id !== action.payload
      );
    },
  },
});

export const {
  addStudent,
  removeStudent,
} = studentsSlice.actions;

export default studentsSlice.reducer;