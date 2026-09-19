import { environment } from '../config/environment';

export type UsuarioActual = {
  id: string;
  personaId: string;
  roles: string[];
  permisos: string[];
  nombreCompleto: string;
  ambitoGlobal?: {
    roles: string[];
    permisos: string[];
  };
  instituciones?: Array<{
    id: string;
    nombre: string;
    nombreCorto?: string | null;
    roles: string[];
    permisos: string[];
    activo?: boolean;
  }>;
};

type SupabasePasswordToken = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: {
    id?: string;
    email?: string;
  };
};

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();

    return (
      body?.mensaje ||
      body?.message ||
      body?.error_description ||
      body?.msg ||
      body?.error ||
      `Error HTTP ${response.status}`
    );
  } catch {
    return `Error HTTP ${response.status}`;
  }
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<SupabasePasswordToken> {
  const response = await fetch(
    `${environment.supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        apikey: environment.supabasePublishableKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function getCurrentUser(
  accessToken: string
): Promise<UsuarioActual> {
  const response = await fetch(
    `${environment.apiUrl.replace(/\/$/, '')}/auth/me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function loginSchoolManager(
  email: string,
  password: string
): Promise<{
  accessToken: string;
  email: string;
  perfil: UsuarioActual;
}> {
  const session = await signInWithPassword(email, password);
  const perfil = await getCurrentUser(session.access_token);

  return {
    accessToken: session.access_token,
    email: session.user?.email || email.trim().toLowerCase(),
    perfil,
  };
}
