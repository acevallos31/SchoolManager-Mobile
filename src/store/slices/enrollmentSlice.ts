import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type EnrollmentState = {
  alumnoId: string | null;
  cicloId: string | null;
  periodoMatriculaId: string | null;
  gradoId: string | null;
  seccionId: string | null;
};

const initialState: EnrollmentState = {
  alumnoId: null,
  cicloId: null,
  periodoMatriculaId: null,
  gradoId: null,
  seccionId: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setAlumnoId: (state, action: PayloadAction<string | null>) => {
      state.alumnoId = action.payload;
    },
    setCicloId: (state, action: PayloadAction<string | null>) => {
      state.cicloId = action.payload;
      state.periodoMatriculaId = null;
      state.gradoId = null;
      state.seccionId = null;
    },
    setPeriodoMatriculaId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.periodoMatriculaId = action.payload;
    },
    setGradoId: (state, action: PayloadAction<string | null>) => {
      state.gradoId = action.payload;
      state.seccionId = null;
    },
    setSeccionId: (state, action: PayloadAction<string | null>) => {
      state.seccionId = action.payload;
    },
    clearEnrollment: () => initialState,
  },
});

export const {
  setAlumnoId,
  setCicloId,
  setPeriodoMatriculaId,
  setGradoId,
  setSeccionId,
  clearEnrollment,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;