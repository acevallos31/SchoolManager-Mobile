import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { Provider } from 'react-redux';
import type { Session } from '@supabase/supabase-js';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/lib/supabase';
import { getUsuarioActual, type UsuarioActual } from '../src/services/authApi';
import { store } from '../src/store';
import { clearUser } from '../src/store/slices/userSlice';
import { setAlumnoId } from '../src/store/slices/enrollmentSlice';
import { addStudent } from '../src/store/slices/studentsSlice';
import { AppState } from 'react-native';

vi.mock('../src/lib/supabase', () => ({
  authConfigurationError: null,
  supabase: { auth: {
    getSession: vi.fn(), onAuthStateChange: vi.fn(), signInWithPassword: vi.fn(), signOut: vi.fn(),
    startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn(),
  } },
}));
vi.mock('../src/services/authApi', () => ({ getUsuarioActual: vi.fn() }));

const session = { access_token: 'token-1', user: { id: 'auth-1', email: 'docente@example.com' } } as Session;
const profile: UsuarioActual = {
  id: 'usuario-1', personaId: 'persona-1', nombreCompleto: 'Ana Pérez',
  roles: ['docente'], permisos: ['alumnos.ver'],
  ambitoGlobal: { roles: [], permisos: [] },
  instituciones: [{ id: 'escuela-1', nombre: 'Escuela', nombreCorto: null, roles: ['docente'], permisos: ['alumnos.ver'] }],
};
const auth = supabase!.auth;
let emit: (event: string, session: Session | null) => void;
let context: ReturnType<typeof useAuth>;
let renderer: ReactTestRenderer | undefined;
const unsubscribe = vi.fn();

function Probe() { context = useAuth(); return null; }
async function mount() {
  await act(async () => { renderer = create(<Provider store={store}><AuthProvider><Probe /></AuthProvider></Provider>); });
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  store.dispatch(clearUser());
  vi.mocked(auth.getSession).mockResolvedValue({ data: { session: null }, error: null });
  vi.mocked(auth.onAuthStateChange).mockImplementation(callback => {
    emit = callback as typeof emit;
    return { data: { subscription: { id: 'test-subscription', callback, unsubscribe } } };
  });
  vi.mocked(auth.signOut).mockResolvedValue({ error: null });
  vi.mocked(getUsuarioActual).mockResolvedValue(profile);
});
afterEach(async () => {
  await act(async () => renderer?.unmount());
  renderer = undefined;
});

describe('AuthProvider', () => {
  it('restaura la sesión pero no concede acceso hasta validar el backend', async () => {
    const pending = deferred<UsuarioActual>();
    vi.mocked(auth.getSession).mockResolvedValue({ data: { session }, error: null });
    vi.mocked(getUsuarioActual).mockReturnValue(pending.promise);
    await mount();
    expect(context.loading).toBe(true);
    expect(context.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    await act(async () => pending.resolve(profile));
    expect(context.user).toEqual(profile);
    expect(store.getState().user).toMatchObject({ name: 'Ana Pérez', role: 'docente', profile, isAuthenticated: true });
    expect(context.hasPermission('alumnos.ver', 'escuela-1')).toBe(true);
    expect(context.hasPermission('alumnos.ver', 'otra-escuela')).toBe(false);
    expect(context.hasPermission('alumnos.ver')).toBe(false);
  });

  it('rechaza el perfil y permite reintentar sin entrar a la app', async () => {
    vi.mocked(getUsuarioActual).mockRejectedValueOnce(new Error('Usuario inactivo'));
    await mount();
    await act(async () => emit('SIGNED_IN', session));
    expect(context.user).toBeNull();
    expect(context.error).toBe('Usuario inactivo');
    expect(context.canRetry).toBe(true);
    expect(store.getState().user.isAuthenticated).toBe(false);
    await act(async () => context.retry());
    expect(context.user).toEqual(profile);
  });

  it('normaliza el correo y no impone el dominio .edu', async () => {
    vi.mocked(auth.signInWithPassword).mockImplementation(async () => {
      emit('SIGNED_IN', session);
      return { data: { session, user: session.user }, error: null };
    });
    await mount();
    await act(async () => context.login(' Docente@Example.com ', ' password '));
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: 'docente@example.com', password: ' password ' });
    expect(getUsuarioActual).toHaveBeenCalledWith('token-1', expect.any(AbortSignal));
    expect(context.user).toEqual(profile);
  });

  it('informa credenciales inválidas sin consultar el perfil', async () => {
    vi.mocked(auth.signInWithPassword).mockResolvedValue({ data: { user: null, session: null }, error: { code: 'invalid_credentials' } } as Awaited<ReturnType<typeof auth.signInWithPassword>>);
    await mount();
    await act(async () => { await expect(context.login('a@example.com', 'bad')).rejects.toThrow('incorrectos'); });
    expect(getUsuarioActual).not.toHaveBeenCalled();
    expect(context.user).toBeNull();
  });

  it('descarta respuestas tardías después de cerrar sesión y limpia Redux', async () => {
    await mount();
    await act(async () => emit('SIGNED_IN', session));
    store.dispatch(setAlumnoId('alumno-anterior'));
    store.dispatch(addStudent({ id: 'a', institucionId: 'i', nombres: 'A', apellidos: 'B', tipoIdentificacion: '', numeroIdentificacion: '', fechaNacimiento: null, rne: null, codigoInterno: null }));
    const pending = deferred<UsuarioActual>();
    vi.mocked(getUsuarioActual).mockReturnValue(pending.promise);
    await act(async () => emit('TOKEN_REFRESHED', { ...session, access_token: 'token-2' }));
    await act(async () => context.logout());
    await act(async () => pending.resolve(profile));
    expect(context.user).toBeNull();
    expect(context.canRetry).toBe(false);
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().enrollment.alumnoId).toBeNull();
    expect(store.getState().students.students).toEqual([]);
    expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('no mezcla una respuesta antigua con una nueva cuenta', async () => {
    const pending = deferred<UsuarioActual>();
    vi.mocked(getUsuarioActual).mockReturnValueOnce(pending.promise).mockResolvedValueOnce({ ...profile, id: 'usuario-2' });
    await mount();
    await act(async () => emit('SIGNED_IN', session));
    await act(async () => emit('SIGNED_IN', { ...session, user: { ...session.user, id: 'auth-2' } }));
    await act(async () => pending.resolve(profile));
    expect(context.user?.id).toBe('usuario-2');
    expect(store.getState().user.profile?.id).toBe('usuario-2');
  });

  it('ignora la restauración antigua si ya llegó SIGNED_OUT', async () => {
    const pending = deferred<Awaited<ReturnType<typeof auth.getSession>>>();
    vi.mocked(auth.getSession).mockReturnValue(pending.promise);
    await mount();
    await act(async () => emit('SIGNED_OUT', null));
    await act(async () => pending.resolve({ data: { session }, error: null }));
    expect(context.user).toBeNull();
    expect(getUsuarioActual).not.toHaveBeenCalled();
  });

  it('mantiene la app bloqueada si falla el cierre de sesión', async () => {
    await mount();
    await act(async () => emit('SIGNED_IN', session));
    vi.mocked(auth.signOut).mockRejectedValueOnce(new Error('offline'));
    await act(async () => context.logout());
    expect(context.user).toBeNull();
    expect(context.error).toContain('No se pudo cerrar');
    expect(store.getState().user.isAuthenticated).toBe(false);
  });

  it('gestiona la renovación al cambiar AppState y elimina la suscripción', async () => {
    await mount();
    expect(auth.startAutoRefresh).toHaveBeenCalled();
    const onChange = vi.mocked(AppState.addEventListener).mock.calls.at(-1)![1];
    onChange('background');
    expect(auth.stopAutoRefresh).toHaveBeenCalled();
    await act(async () => renderer?.unmount());
    renderer = undefined;
    expect(unsubscribe).toHaveBeenCalled();
  });
});
