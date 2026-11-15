import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { socket } from "../../services/socket";
import "./Chat.css";

interface Participant {
  _id: string;
  username?: string;
  email: string;
}

interface Message {
  _id: string;
  text: string;
  senderId:
    | {
        _id: string;
        username?: string;
        email: string;
      }
    | string;
  sentAt: string;
}

interface ChatInfo {
  _id: string;
  participants: Participant[];
}

function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [texto, setTexto] = useState("");
  const [nomeParticipante, setNomeParticipante] = useState("Participante");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!chatId) return;

    let ativo = true;

    async function carregarMensagens() {
      try {
        const resposta = await apiRequest(`/api/messages/chat/${chatId}`);

        if (ativo) {
          setMensagens(resposta);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao carregar mensagens.",
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    async function carregarParticipante() {
      try {
        const resposta = await apiRequest("/api/chats");

        const conversa = resposta.find((chat: ChatInfo) => chat._id === chatId);

        if (conversa) {
          const outro = conversa.participants.find(
            (participante: Participant) => participante._id !== usuario.id,
          );

          if (ativo && outro) {
            setNomeParticipante(outro.username || outro.email);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar participante:", error);
      }
    }

    function receberMensagem(message: Message) {
      if (!ativo) return;

      setMensagens((anteriores) => {
        const jaExiste = anteriores.some((item) => item._id === message._id);

        if (jaExiste) return anteriores;

        return [...anteriores, message];
      });
    }

    function entrarNaConversa() {
      socket.emit("entrar_conversa", chatId);
    }

    function receberErroSocket(mensagem: string) {
      if (ativo) setErro(mensagem);
    }

    socket.auth = { token };

    socket.on("connect", entrarNaConversa);
    socket.on("nova_mensagem", receberMensagem);
    socket.on("erro_socket", receberErroSocket);

    if (socket.connected) {
      entrarNaConversa();
    } else {
      socket.connect();
    }

    carregarMensagens();
    carregarParticipante();

    return () => {
      ativo = false;

      socket.off("connect", entrarNaConversa);
      socket.off("nova_mensagem", receberMensagem);
      socket.off("erro_socket", receberErroSocket);
      socket.disconnect();
    };
  }, [chatId, navigate, usuario.id]);

  async function enviarMensagem(event: React.FormEvent) {
    event.preventDefault();

    if (!texto.trim() || !chatId) return;

    try {
      setEnviando(true);
      setErro("");

      const resposta = await apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          chatId,
          text: texto,
        }),
      });

      setMensagens((anteriores) => {
        const jaExiste = anteriores.some(
          (message) => message._id === resposta.message._id,
        );

        if (jaExiste) return anteriores;

        return [...anteriores, resposta.message];
      });

      setTexto("");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a mensagem.",
      );
    } finally {
      setEnviando(false);
    }
  }

  function mensagemDoUsuario(message: Message) {
    const remetente =
      typeof message.senderId === "string"
        ? message.senderId
        : message.senderId._id;

    return remetente === usuario.id;
  }

  function nomeRemetente(message: Message) {
    if (mensagemDoUsuario(message)) return "Você";

    if (typeof message.senderId !== "string") {
      return (
        message.senderId.username || message.senderId.email || nomeParticipante
      );
    }

    return nomeParticipante;
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button onClick={() => navigate("/conversas")}>← Voltar</button>

        <h1>Conversa com {nomeParticipante}</h1>
      </header>

      <section className="chat-mensagens">
        {carregando && <p>Carregando mensagens...</p>}

        {!carregando && mensagens.length === 0 && (
          <p className="chat-vazio">
            Esta conversa ainda não possui mensagens. Envie a primeira!
          </p>
        )}

        {mensagens.map((message) => (
          <div
            key={message._id}
            className={`mensagem ${
              mensagemDoUsuario(message) ? "mensagem-propria" : "mensagem-outra"
            }`}
          >
            <strong>{nomeRemetente(message)}</strong>

            <p>{message.text}</p>

            <span>{new Date(message.sentAt).toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </section>

      {erro && <p className="chat-erro">{erro}</p>}

      <form className="chat-form" onSubmit={enviarMensagem}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
        />

        <button type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </main>
  );
}

export default Chat;
