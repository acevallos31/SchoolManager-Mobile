import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthApiError, getUsuarioActual, parseUsuarioActual } from '../src/services/authApi';

const profile = {
  id: 'usuario-id', personaId: 'persona-id', roles: ['docente'], permisos: ['alumnos.ver'],
  ambitoGlobal: { roles: [], permisos: [] },
  instituciones: [{ id: 'escuela-1', nombre: 'Escuela', nombreCorto: null, roles: ['docente'], permisos: ['alumnos.ver'] }],
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });

describe('/api/auth/me', () => {
  it('envía el token Bearer y conserva los ámbitos del backend', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://school.example/api/');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(profile)));
    vi.stubGlobal('fetch', fetchMock);
    expect(await getUsuarioActual('access-token')).toEqual(profile);
    expect(fetchMock).toHaveBeenCalledWith('https://school.example/api/auth/me', expect.objectContaining({
      method: 'GET', headers: { Authorization: 'Bearer access-token', Accept: 'application/json' },
    }));
  });

  it.each([
    [401, null, 'expiró'],
    [403, 'IDENTIDAD_NO_VINCULADA', 'no está vinculada'],
    [403, 'USUARIO_INACTIVO', 'inactivo'],
    [403, 'SESION_INVALIDA', 'no es válida'],
    [403, null, 'No tienes acceso'],
    [500, null, 'servidor'],
  ])('rechaza HTTP %s / %s', async (status, codigo, message) => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://school.example/api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ codigo }), { status })));
    await expect(getUsuarioActual('token')).rejects.toMatchObject({ status, message: expect.stringContaining(message) });
  });

  it.each([null, {}, { ...profile, permisos: 'admin' }, { ...profile, instituciones: [{}] }, { ...profile, ambitoGlobal: null }])('rechaza perfiles malformados', value => {
    expect(() => parseUsuarioActual(value)).toThrow(AuthApiError);
  });

  it('admite el contrato anterior sin inventar ámbitos', () => {
    const legacy = { id: 'id', personaId: 'persona', roles: [], permisos: [] };
    expect(parseUsuarioActual(legacy)).toEqual(legacy);
  });

  it('informa errores de red sin devolver acceso', async () => {
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://school.example/api');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network')));
    await expect(getUsuarioActual('token')).rejects.toThrow('Revisa tu conexión');
  });

  it('aborta una validación que supera 30 segundos', async () => {
    vi.useFakeTimers();
    vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://school.example/api');
    vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    })));
    const result = expect(getUsuarioActual('token')).rejects.toThrow('tardó demasiado');
    await vi.advanceTimersByTimeAsync(30000);
    await result;
  });
});
