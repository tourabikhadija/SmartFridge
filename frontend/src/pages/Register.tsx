import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Login.css";
import roctLogo from "../assets/ROCT.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (name.trim().length < 2) {
    setError("Le nom doit contenir au moins 2 caractères");
    return;
  }

  if (name.trim().length > 50) {
    setError("Le nom est trop long");
    return;
  }

  if (!email.includes("@")) {
    setError("Veuillez entrer un email valide");
    return;
  }

  if (password.length < 6) {
    setError("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  if (password.length > 100) {
    setError("Le mot de passe est trop long");
    return;
  }

  if (password !== confirmPassword) {
    setError("Les mots de passe ne correspondent pas");
    return;
  }

  try {
    const response = await registerUser(
      name.trim(),
      email.trim(),
      password
    );

    setSuccess(response.message);
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

        <img
          src={roctLogo}
          alt="ROCT logo"
          className="login-logo"
        />

        <h2 className="Parte-Welcome">
          Create Account
        </h2>

        <p className="login-subtitle">
          Create your ROCT account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>

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
            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm Password"
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          <button className="login-button" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;