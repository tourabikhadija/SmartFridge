import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import roctLogo from "../assets/ROCT.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!email.includes("@")) {
    setError("Veuillez entrer un email valide");
    return;
  }

  if (password.length < 1) {
    setError("Le mot de passe est requis");
    return;
  }

  try {
    const response = await loginUser(
      email.trim(),
      password
    );
    

    localStorage.setItem("token", response.token);
    console.log("User connecté :", response.user);
    navigate("/dashboard");
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Une erreur est survenue");
    }
  }
};

return (
  <div className="login-page">
    <div className="login-card">

     <img src={roctLogo} alt="ROCT logo" className="login-logo" />      
      <h2 className="Parte-Welcome">Welcome Back</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email adress"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        <button className="login-button" type="submit">
          Login
        </button>

      </form>

    </div>
  </div>
);
}

export default Login;