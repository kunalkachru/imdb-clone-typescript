import { createContext } from "react";
import type { AuthContextType } from "../types/auth";

// TS LESSON: createContext with AuthContextType | null
export const AuthContext = createContext<AuthContextType | null>(null);
