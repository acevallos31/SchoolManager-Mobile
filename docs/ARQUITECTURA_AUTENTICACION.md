# Arquitectura de autenticación — SchoolManager Mobile

## Objetivo

Definir cómo SchoolManager Mobile manejará autenticación, sesión y autorización, manteniendo compatibilidad con la arquitectura del proyecto principal SchoolManager.

## Decisión

SchoolManager Mobile utilizará **Supabase Auth** como proveedor central de autenticación. Supabase podrá usar **Google OAuth** y, cuando sea necesario, otros métodos de autenticación soportados.

La autenticación y la autorización se mantienen separadas:

- **Supabase Auth** verifica la identidad del usuario y administra la sesión.
- **SchoolManager.API** valida el JWT emitido por Supabase y resuelve el usuario de aplicación.
- **PostgreSQL / SchoolManager** mantiene roles, permisos e institución.
- **Redux** mantiene el estado global de aplicación necesario para la interfaz.
- **AuthContext** encapsulará la sesión Supabase, login, logout, restauración de sesión y estado de carga.

## Flujo de autenticación

```text
Google OAuth
    ↓
Supabase Auth
    ↓
JWT / sesión Supabase
    ↓
AuthContext
    ↓
SchoolManager.API
    ↓
usuarios.auth_user_id
    ↓
usuarios_roles → roles → permisos
    ↓
Redux userSlice
```

## Responsabilidades

### Supabase Auth

Responsable de:

- inicio de sesión;
- Google OAuth;
- emisión del JWT;
- refresh token;
- persistencia y restauración de sesión;
- cierre de sesión.

El JWT no será generado por SchoolManager.API. El backend únicamente lo valida.

### AuthContext

`AuthContext` será responsable de la sesión de autenticación y expondrá, como mínimo:

```ts
type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
```

La estructura prevista será:

```text
src/
├── contexts/
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx
└── store/
    ├── index.ts
    ├── hooks.ts
    └── slices/
        └── userSlice.ts
```

El Context no sustituye la persistencia. La sesión persistente será responsabilidad de Supabase y del almacenamiento seguro configurado para Expo.

### SchoolManager.API

Después de recibir el Bearer token:

```text
Authorization: Bearer <access_token>
```

la API deberá:

1. validar el JWT de Supabase;
2. obtener el claim `sub`;
3. buscar el usuario por `usuarios.auth_user_id`;
4. verificar que el usuario esté activo;
5. cargar sus roles, permisos e institución;
6. aplicar autorización en cada endpoint.

Un usuario autenticado en Supabase no obtiene acceso automáticamente a SchoolManager. Debe existir y estar autorizado dentro del modelo de usuarios de SchoolManager.

## Redux

Redux no almacenará el access token ni el refresh token como fuente principal de sesión.

`userSlice` almacenará estado de aplicación, por ejemplo:

```ts
type UserState = {
  authUserId: string | null;
  userId: string | null;
  name: string;
  email: string;
  institutionId: string | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
};
```

Los roles y permisos no se asignarán manualmente en producción. Serán obtenidos desde SchoolManager.API después de una autenticación válida.

## Restauración de sesión

Al volver a abrir la aplicación:

```text
App inicia
    ↓
Supabase restaura sesión
    ↓
si es necesario renueva access token
    ↓
AuthContext recibe la sesión
    ↓
GET /api/usuarios/me
    ↓
SchoolManager.API devuelve perfil, roles y permisos
    ↓
Redux vuelve a cargar userSlice
```

Por lo tanto, cerrar la aplicación no debe obligar al usuario a iniciar sesión nuevamente mientras la sesión Supabase siga siendo válida.

## Cierre de sesión

El cierre de sesión debe limpiar ambas capas:

```ts
await supabase.auth.signOut();
dispatch(clearUser());
```

## Regla de seguridad

Redux y la interfaz móvil pueden usar permisos para mostrar u ocultar opciones, pero **la seguridad real siempre será aplicada por SchoolManager.API**.

Ejemplo:

```text
Redux indica alumnos.crear
    ↓
la app muestra el botón Crear alumno

POST /api/alumnos
    ↓
SchoolManager.API vuelve a validar alumnos.crear
```

Modificar el estado local de Redux nunca debe permitir saltarse una autorización del backend.

## Relación con el frontend Angular

El frontend Angular del proyecto principal y SchoolManager Mobile deben compartir el mismo modelo de identidad:

```text
Angular ───────┐
               ├── Supabase Auth ── JWT ── SchoolManager.API
Mobile Expo ───┘
```

Google actúa como proveedor externo de identidad, Supabase Auth como servicio central de autenticación y SchoolManager.API como autoridad para roles, permisos y reglas de negocio.

Esto permite que una misma cuenta represente al mismo usuario tanto en la aplicación web como en la aplicación móvil mediante `usuarios.auth_user_id`.

## Alcance actual

Para el segundo entregable de Programación Móvil, la integración con Supabase Auth puede implementarse de forma incremental. Redux se utiliza primero para demostrar estado global, reducers, `useSelector` y `useDispatch`. La autenticación real y la carga de roles/permisos desde SchoolManager.API se incorporarán sin cambiar la separación de responsabilidades definida en este documento.
