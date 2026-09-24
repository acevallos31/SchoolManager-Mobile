import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { authConfigurationError, supabase } from '../lib/supabase';
import { getUsuarioActual, type UsuarioActual } from '../services/authApi';
import { useAppDispatch } from '../store/hooks';
import { clearUser, setUser } from '../store/slices/userSlice';

type AuthContextType = {
  user: UsuarioActual | null;
  loading: boolean;
  error: string | null;
  canRetry: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retry: () => Promise<void>;
  hasPermission: (permission: string, institucionId?: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setProfile] = useState<UsuarioActual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(authConfigurationError);
  const [canRetry, setCanRetry] = useState(false);
  const sessionRef = useRef<Session | null>(null);
  const generation = useRef(0);
  const request = useRef<AbortController | null>(null);
  const signingOut = useRef(false);
  const signingIn = useRef(false);
  const accountId = useRef<string | null>(null);

  const validateSession = useCallback(async (session: Session | null) => {
    const current = ++generation.current;
    request.current?.abort();
    sessionRef.current = session;
    setProfile(null);
    setError(null);
    setCanRetry(!!session);
    if (accountId.current !== session?.user.id) dispatch(clearUser());
    accountId.current = session?.user.id ?? null;
    if (!session) {
      dispatch(clearUser());
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    request.current = controller;
    try {
      const profile = await getUsuarioActual(session.access_token, controller.signal);
      if (current !== generation.current) return;
      dispatch(setUser({
        name: profile.nombreCompleto || session.user.email || 'Usuario SchoolManager',
        email: session.user.email ?? '',
        role: profile.roles.join(', '),
        profile,
      }));
      setProfile(profile);
    } catch (cause) {
      if (current !== generation.current) return;
      dispatch(clearUser());
      setError(cause instanceof Error ? cause.message : 'No se pudo validar el acceso.');
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const client = supabase;
    if (!client || authConfigurationError) {
      dispatch(clearUser());
      setLoading(false);
      return;
    }
    let active = true;
    let receivedEvent = false;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      receivedEvent = true;
      // No await ni llamadas de vuelta a Supabase dentro del callback de Auth.
      if (active && !signingOut.current) void validateSession(session);
    });
    void client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || receivedEvent) return;
      if (sessionError) throw sessionError;
      return validateSession(data.session);
    }).catch(() => {
      if (!active || receivedEvent) return;
      dispatch(clearUser());
      setError('No se pudo recuperar la sesión. Intenta iniciar sesión nuevamente.');
      setLoading(false);
    });
    const refresh = (state: string) => {
      if (state === 'active') {
        void client.auth.startAutoRefresh();
      } else {
        void client.auth.stopAutoRefresh();
      }
    };
    const appState = Platform.OS !== 'web' ? AppState.addEventListener('change', refresh) : null;
    if (Platform.OS !== 'web') refresh(AppState.currentState);
    return () => {
      active = false;
      ++generation.current;
      request.current?.abort();
      subscription.unsubscribe();
      appState?.remove();
      if (Platform.OS !== 'web') void client.auth.stopAutoRefresh();
    };
  }, [dispatch, validateSession]);

  const login = async (email: string, password: string) => {
    if (!supabase || authConfigurationError) throw new Error(authConfigurationError ?? 'Supabase no está configurado.');
    if (signingIn.current || signingOut.current) return;
    signingIn.current = true;
    setError(null);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (loginError) {
        const message = loginError.code === 'invalid_credentials' ? 'Correo o contraseña incorrectos.'
          : loginError.code === 'email_not_confirmed' ? 'Debes confirmar tu correo antes de ingresar.'
            : 'No se pudo iniciar sesión. Revisa tus datos y tu conexión.';
        throw new Error(message);
      }
      // El evento de Auth valida /auth/me antes de habilitar la navegacion.
    } finally {
      signingIn.current = false;
    }
  };

  const logout = async () => {
    if (!supabase || signingOut.current) return;
    signingOut.current = true;
    ++generation.current;
    request.current?.abort();
    setProfile(null);
    setCanRetry(false);
    dispatch(clearUser());
    setLoading(true);
    try {
      const { error: logoutError } = await supabase.auth.signOut({ scope: 'local' });
      if (logoutError) throw logoutError;
      sessionRef.current = null;
      accountId.current = null;
      setError(null);
    } catch {
      setError('No se pudo cerrar la sesión guardada. Revisa tu conexión y vuelve a intentar cerrar sesión.');
      setCanRetry(!!sessionRef.current);
    } finally {
      signingOut.current = false;
      setLoading(false);
    }
  };

  const hasPermission = (permission: string, institucionId?: string) => {
    if (!user) return false;
    // No usar la union de permisos como sustituto de un ambito explicito.
    return institucionId
      ? user.instituciones?.find(institution => institution.id === institucionId)?.permisos.includes(permission) ?? false
      : user.ambitoGlobal?.permisos.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, canRetry, login, logout, retry: () => validateSession(sessionRef.current), hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
