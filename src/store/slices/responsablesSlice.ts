import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Responsable = {
  id: string;
  alumnoId: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  parentesco: string;
};

export type ResponsablesState = {
  responsables: Responsable[];
};

const initialState: ResponsablesState = {
  responsables: [],
};

const responsablesSlice = createSlice({
  name: 'responsables',
  initialState,
  reducers: {
    addResponsable: (
      state,
      action: PayloadAction<Responsable>
    ) => {
      state.responsables.push(action.payload);
    },

    removeResponsable: (
      state,
      action: PayloadAction<string>
    ) => {
      state.responsables = state.responsables.filter(
        (responsable) => responsable.id !== action.payload
      );
    },
  },
});

export const {
  addResponsable,
  removeResponsable,
} = responsablesSlice.actions;

export default responsablesSlice.reducer;