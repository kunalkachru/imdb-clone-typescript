import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContextDef";
import type { ThemeContextType } from "../context/ThemeContextDef";

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
