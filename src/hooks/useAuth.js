import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");

  const user =
    userData && userData !== "undefined" ? JSON.parse(userData) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return {
    user,
    logout,
  };
}
