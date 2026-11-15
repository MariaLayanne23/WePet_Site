import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Salvar token e dados do usuário
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

      alert("Login realizado com sucesso!");

      // Redirecionar para a Home
      navigate("/home");

      console.log("Usuário autenticado:", data.usuario);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <header className="login-brand">
          <div className="login-logo">🐾</div>
          <h1>
            We<span>Pet</span>
          </h1>
          <p>O jeito inteligente de adotar</p>
        </header>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {erro && <p className="login-error">{erro}</p>}

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="register-button"
            onClick={() => (window.location.href = "/cadastro")}
          >
            Criar conta
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
