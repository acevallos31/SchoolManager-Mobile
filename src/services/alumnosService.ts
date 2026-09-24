import { environment } from '../config/environment';

export type AlumnoApi = {
  id: string;
  personaId: string;
  institucionId: string;
  nombreCompleto: string;
  identidad?: string | null;
  rne?: string | null;
  codigoInterno?: string | null;
  estado: string;
  matriculaActual?: {
    id: string;
    seccion: string;
    grado: string;
    ciclo: string;
  } | null;
};

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body?.mensaje || body?.message || body?.error || `Error HTTP ${response.status}`;
  } catch {
    return `Error HTTP ${response.status}`;
  }
}

export async function listarAlumnos(
  accessToken: string,
  institutionId?: string
): Promise<AlumnoApi[]> {
  const query = institutionId
    ? `?institucionId=${encodeURIComponent(institutionId)}`
    : '';

  const response = await fetch(
    `${environment.apiUrl.replace(/\/$/, '')}/alumnos${query}`,
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

  const data = await response.json();
  return Array.isArray(data) ? data : data?.items || [];
}
