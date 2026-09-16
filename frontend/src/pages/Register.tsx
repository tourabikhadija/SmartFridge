import { useState } from "react";
import { registerUser } from "../services/authService";

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
    <div>
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
          />
        </div>

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
            placeholder="Minimum 6 caractères"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre mot de passe"
          />
        </div>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}

        <button type="submit">Créer mon compte</button>
      </form>
    </div>
  );
}

export default Register;