import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// TS LESSON: children prop
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // TS LESSON: type narrowing — if no user redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user exists — render children
  return <>{children}</>;
};

export default ProtectedRoute;
