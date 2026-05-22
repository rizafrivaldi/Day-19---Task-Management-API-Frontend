import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", formData);

      // Save token
      localStorage.setItem("token", response.data.data.token);

      alert("Login successful 🚀");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <Link to="/register">Go to Register</Link>
    </div>
  );
}

export default Login;
