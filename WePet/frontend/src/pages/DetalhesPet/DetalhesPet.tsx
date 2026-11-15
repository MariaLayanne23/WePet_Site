import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./DetalhesPet.css";

interface Pet {
  _id: string;
  name: string;
  species: "gato" | "cachorro";
  breed?: string;
  sex?: string;
  age: number;
  ageUnit: "meses" | "anos";
  description?: string;
  adoptionStatus: "disponivel" | "adotado";
}

function DetalhesPet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarPet() {
      try {
        const resposta = await apiRequest(`/api/pets/${id}`);
        setPet(resposta);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o animal.",
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarPet();
  }, [id]);

  function formatarIdade() {
    if (!pet) return "";

    if (pet.ageUnit === "meses") {
      return `${pet.age} ${pet.age === 1 ? "mês" : "meses"}`;
    }

    return `${pet.age} ${pet.age === 1 ? "ano" : "anos"}`;
  }

  async function iniciarConversa() {
    setMensagem("");

    const token = sessionStorage.getItem("token");
    const usuarioSalvo = sessionStorage.getItem("usuario");

    if (!token || !usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.role !== "adotante") {
        setMensagem("Somente adotantes podem iniciar uma conversa.");
        return;
      }

      if (!pet || pet.adoptionStatus !== "disponivel") {
        setMensagem("Este animal não está disponível para adoção.");
        return;
      }

      setEnviando(true);

      const resposta = await apiRequest("/api/chats", {
        method: "POST",
        body: JSON.stringify({ petId: pet._id }),
      });

      setMensagem(resposta.mensagem);
    } catch (error) {
      setMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar a conversa.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p>Carregando informações...</p>;
  if (erro || !pet) return <p>{erro || "Animal não encontrado."}</p>;

  return (
    <main className="detalhes-page">
      <button className="voltar-btn" onClick={() => navigate("/home")}>
        ← Voltar
      </button>

      <section className="detalhes-container">
        <div className="detalhes-imagem">
          {pet.species === "gato" ? "🐱" : "🐶"}
        </div>

        <div className="detalhes-info">
          <span className="detalhes-status">
            {pet.adoptionStatus === "disponivel"
              ? "Disponível para adoção"
              : "Já adotado"}
          </span>

          <h1>{pet.name}</h1>

          <p>
            <strong>Espécie:</strong> {pet.species}
          </p>

          <p>
            <strong>Raça:</strong> {pet.breed || "Não informada"}
          </p>

          <p>
            <strong>Idade:</strong> {formatarIdade()}
          </p>

          <p>
            <strong>Sexo:</strong>{" "}
            {pet.sex === "macho"
              ? "Macho"
              : pet.sex === "femea"
                ? "Fêmea"
                : "Não informado"}
          </p>

          <div className="detalhes-descricao">
            <h2>Sobre {pet.name}</h2>
            <p>{pet.description || "Sem descrição disponível."}</p>
          </div>

          {pet.adoptionStatus === "disponivel" && (
            <button
              className="interesse-btn"
              onClick={iniciarConversa}
              disabled={enviando}
            >
              {enviando ? "Iniciando conversa..." : "Tenho interesse em adotar"}
            </button>
          )}

          {mensagem && <p className="mensagem-contato">{mensagem}</p>}
        </div>
      </section>
    </main>
  );
}

export default DetalhesPet;
