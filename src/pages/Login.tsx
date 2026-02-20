import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types/auth";
import { AuthStatus } from "../types/auth";

const Login = () => {
  const { login, status, error } = useAuth();
  const navigate = useNavigate();

  // TS LESSON: Partial<LoginCredentials> for form state
  // fields start empty — not full LoginCredentials yet
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  // TS LESSON: typing form input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // computed property — updates only the changed field
    }));
  };

  // TS LESSON: typing form submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData); // formData is LoginCredentials — fully typed
    navigate("/"); // redirect after login
  };

  // TS LESSON: comparing with enum value
  const isLoading = status === AuthStatus.LOADING;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-yellow-400 text-3xl font-black mb-2">
            🎬 IMDBClone
          </h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
