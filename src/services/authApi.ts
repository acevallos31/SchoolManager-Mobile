export type AmbitoAcceso = { roles: string[]; permisos: string[] };
export type InstitucionAcceso = AmbitoAcceso & {
  id: string;
  nombre: string;
  nombreCorto: string | null;
};

export type UsuarioActual = AmbitoAcceso & {
  id: string;
  personaId: string;
  nombreCompleto?: string;
  ambitoGlobal?: AmbitoAcceso;
  instituciones?: InstitucionAcceso[];
  institucionesAdministrables?: InstitucionAcceso[];
};

export class AuthApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly codigo?: string) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isScope(value: unknown): value is AmbitoAcceso & Record<string, unknown> {
  return isRecord(value) && Array.isArray(value.roles) && Array.isArray(value.permisos)
    && value.roles.every(role => typeof role === 'string')
    && value.permisos.every(permission => typeof permission === 'string');
}

function isInstitution(value: unknown): value is InstitucionAcceso {
  return isRecord(value) && isScope(value) && typeof value.id === 'string'
    && typeof value.nombre === 'string'
    && (value.nombreCorto === null || typeof value.nombreCorto === 'string');
}

export function parseUsuarioActual(value: unknown): UsuarioActual {
  if (!isRecord(value) || !isScope(value) || typeof value.id !== 'string' || !value.id
    || typeof value.personaId !== 'string' || !value.personaId
    || (value.nombreCompleto !== undefined && typeof value.nombreCompleto !== 'string')
    || (value.ambitoGlobal !== undefined && !isScope(value.ambitoGlobal))
    || (value.instituciones !== undefined && (!Array.isArray(value.instituciones) || !value.instituciones.every(isInstitution)))
    || (value.institucionesAdministrables !== undefined && (!Array.isArray(value.institucionesAdministrables) || !value.institucionesAdministrables.every(isInstitution)))) {
    throw new AuthApiError('El servidor devolvió un perfil de usuario inválido.', 502);
  }
  return value as UsuarioActual;
}

export async function getUsuarioActual(accessToken: string, signal?: AbortSignal): Promise<UsuarioActual> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) throw new AuthApiError('Falta configurar la URL de la API.', 0);
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort);
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 30000);
  try {
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null);
      const codigo = isRecord(body) && typeof body.codigo === 'string' ? body.codigo : undefined;
      const messages: Record<string, string> = {
        IDENTIDAD_NO_VINCULADA: 'Tu cuenta no está vinculada a SchoolManager. Contacta al administrador.',
        USUARIO_INACTIVO: 'Tu usuario está inactivo. Contacta al administrador.',
        SESION_INVALIDA: 'La sesión no es válida. Vuelve a iniciar sesión.',
      };
      throw new AuthApiError(
        (codigo && messages[codigo]) || (response.status === 401
          ? 'La sesión expiró. Vuelve a iniciar sesión.'
          : response.status === 403 ? 'No tienes acceso a SchoolManager.'
            : 'No se pudo validar el acceso con el servidor. Intenta nuevamente.'), response.status, codigo,
      );
    }
    return parseUsuarioActual(await response.json());
  } catch (error) {
    if (error instanceof AuthApiError) throw error;
    throw new AuthApiError(controller.signal.aborted
      ? 'La validación se interrumpió o tardó demasiado. Intenta nuevamente.'
      : 'No se pudo conectar con SchoolManager. Revisa tu conexión e intenta nuevamente.', 0);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
