import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth";

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

// Mock users database — simulates a backend
const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

// generate a fake JWT-like token
const generateToken = (userId: number): string => {
  return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
};

// simulate network delay — feels realistic
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  await delay(800); // simulate network request

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
  );

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  // Omit password before returning — never send password back
  const { password: _password, ...safeUser } = user;

  return {
    user: safeUser,
    token: generateToken(user.id),
  };
};

export const registerUser = async (
  credentials: RegisterCredentials,
): Promise<AuthResponse> => {
  await delay(800);

  // check if email already exists
  const exists = MOCK_USERS.find((u) => u.email === credentials.email);
  if (exists) {
    throw new AuthError("Email already registered", 409);
  }

  // create new user
  const newUser = {
    id: MOCK_USERS.length + 1,
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
    createdAt: new Date().toISOString(),
  };

  MOCK_USERS.push(newUser); // add to mock DB

  const { password: _password, ...safeUser } = newUser;

  return {
    user: safeUser,
    token: generateToken(newUser.id),
  };
};
