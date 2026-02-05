"use client";

import { useState } from "react";
import { adminLogin } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await adminLogin(email, password);

      console.log("LOGIN RESPONSE 👉", data);

      if (!data.token) {
        alert("Token missing");
        return;
      }

      login(data.token);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-900 px-4">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Login to access admin dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@ecommerce.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button
            onClick={handleLogin}
            type="button"
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-8">
          © {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
}
