import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./MinhasConversas.css";

interface Pet {
  _id: string;
  name: string;
  species: string;
}

interface User {
  id?: string;
  _id?: string;
  email: string;
  role: string;
}

interface Chat {
  _id: string;
  petId: Pet;
  participants: User[];
}

function MinhasConversas() {
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarConversas() {
      try {
        const resposta = await apiRequest("/api/chats");

        if (!Array.isArray(resposta)) {
          throw new Error("Não foi possível carregar as conversas.");
        }

        setChats(resposta);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar conversas.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarConversas();
  }, []);

  return (
    <main className="conversas-page">
      <button onClick={() => navigate("/home")} className="voltar-btn">
        ← Voltar
      </button>

      <h1>Minhas conversas</h1>
      <p>Acompanhe seus contatos sobre adoção.</p>

      {carregando && <p>Carregando conversas...</p>}

      {erro && <p className="conversas-erro">{erro}</p>}

      {!carregando && !erro && chats.length === 0 && (
        <p>Você ainda não possui conversas.</p>
      )}

      <section className="conversas-lista">
        {chats.map((chat) => {
          const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

          const outroParticipante = chat.participants.find(
            (participante) =>
              (participante._id || participante.id) !== usuario.id,
          );

          return (
            <article
              key={chat._id}
              className="conversa-card"
              onClick={() => navigate(`/chat/${chat._id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="conversa-avatar">
                {chat.petId?.species === "gato" ? "🐱" : "🐶"}
              </div>

              <div className="conversa-info">
                <h2>{chat.petId?.name || "Animal"}</h2>
                <p>
                  Conversa com: {outroParticipante?.email || "Participante"}
                </p>
              </div>

              <span>›</span>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default MinhasConversas;
