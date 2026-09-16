import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;