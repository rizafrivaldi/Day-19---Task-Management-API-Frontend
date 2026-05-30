import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (err) {
      console.log("Login Error:", err);
      console.log("Response:", err.response);

      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <input
          className="w-full border p-3 rounded mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          className="w-full border p-3 rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />
        <div className="bg-center text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
