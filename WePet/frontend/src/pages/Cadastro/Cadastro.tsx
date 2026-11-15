import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("adotante");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await apiRequest("/api/auth/cadastro", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-container">
        <header className="cadastro-brand">
          <div className="cadastro-logo">🐾</div>
          <h1>
            We<span>Pet</span>
          </h1>
          <p>Crie sua conta e faça parte dessa conexão!</p>
        </header>

        <form onSubmit={handleCadastro} className="cadastro-form">
          <div className="cadastro-field">
            <label>Tipo de conta</label>

            <div className="tipo-conta">
              <button
                type="button"
                className={role === "adotante" ? "ativo" : ""}
                onClick={() => setRole("adotante")}
              >
                Adotante
              </button>

              <button
                type="button"
                className={role === "protetor" ? "ativo" : ""}
                onClick={() => setRole("protetor")}
              >
                Protetor
              </button>
            </div>
          </div>

          <div className="cadastro-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="cadastro-field">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {erro && <p className="cadastro-error">{erro}</p>}

          <button
            type="submit"
            className="cadastro-button"
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>

          <p className="voltar-login">
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
