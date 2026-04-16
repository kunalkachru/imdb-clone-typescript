// Base User interface — single source of truth
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Utility types derived from User:

// Login — only needs email + password
export type LoginCredentials = Pick<User, "email" | "password">;

// Register — needs name, email, password (server generates id + createdAt)
export type RegisterCredentials = Omit<User, "id" | "createdAt">;

// Stored in context — NEVER store password in memory
export type AuthUser = Omit<User, "password">;

// Update profile — all fields optional, can't update id or createdAt
export type UpdateUserData = Partial<Omit<User, "id" | "createdAt">>;

// enum — auth status as named constants
// 'as const' makes the object readonly and values literal types
export const AuthStatus = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

// API response shape
export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// Auth context shape
export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

// Auth reducer action — discriminated union
export type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: AuthUser; token: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" };
