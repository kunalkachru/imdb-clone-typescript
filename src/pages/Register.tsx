import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RegisterCredentials } from "../types/auth";
import { AuthStatus } from "../types/auth";

const Register = () => {
  const { register, status, error } = useAuth();
  const navigate = useNavigate();

  // TS LESSON: RegisterCredentials = Omit<User, 'id' | 'createdAt'>
  // name, email, password — all required
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isSuccess = await register(formData);
    if (isSuccess) {
      navigate("/");
    }
  };

  const isLoading = status === AuthStatus.LOADING;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-yellow-400 text-3xl font-black mb-2">
            🎬 IMDBClone
          </h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-400 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
