import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);

      alert("Register succesful");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert("Register failed");
    }
  };

  return (
    <div>
      <h1>Register Page</h1>

      <form onSubmit={handleRegister}>
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

        <button type="submit">Register</button>
      </form>

      <br />

      <Link to="/">Go to Login</Link>
    </div>
  );
}

export default Register;
