import { useReducer } from "react";
import type {
  AuthUser,
  AuthAction,
  AuthContextType,
  AuthStatus,
} from "../types/auth";
import { loginUser, registerUser } from "../services/auth";
import type { LoginCredentials, RegisterCredentials } from "../types/auth";
import { AuthStatus as AuthStatusEnum } from "../types/auth";
import { AuthContext } from "./AuthContextDef";

// TS LESSON: reducer state shape — separate from context shape
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
}
// restore auth from localStorage on app start
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
  token: storedToken ?? null,
  status: AuthStatusEnum.IDLE,
  error: null,
};

const loggedOutState: AuthState = {
  user: null,
  token: null,
  status: AuthStatusEnum.IDLE,
  error: null,
};

// TS LESSON: reducer with discriminated union actions
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        status: AuthStatusEnum.LOADING,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        status: AuthStatusEnum.SUCCESS,
        user: action.payload.user, // TypeScript KNOWS payload has user + token
        token: action.payload.token,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        status: AuthStatusEnum.ERROR,
        error: action.payload, // TypeScript KNOWS payload is string
        user: null,
        token: null,
      };

    case "AUTH_LOGOUT":
      return loggedOutState;
  }
}

// Provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // TS LESSON: async function with typed parameter
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: "AUTH_START" });
      const { user, token } = await loginUser(credentials);
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });

      // store token in localStorage for persistence
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (err: unknown) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err instanceof Error ? err.message : "Login failed",
      });
      return false;
    }
  };

  // TS LESSON: same pattern for register
  const register = async (
    credentials: RegisterCredentials,
  ): Promise<boolean> => {
    try {
      dispatch({ type: "AUTH_START" });
      const { user, token } = await registerUser(credentials);
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (err: unknown) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err instanceof Error ? err.message : "Registration failed",
      });
      return false;
    }
  };

  const logout = (): void => {
    dispatch({ type: "AUTH_LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // TS LESSON: spreading state into context value
  // state has same shape as AuthContextType fields
  const contextValue: AuthContextType = {
    ...state, // spreads user, token, status, error
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
