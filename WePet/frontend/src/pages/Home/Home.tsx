import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./Home.css";

interface Pet {
  _id: string;
  name: string;
  species: "gato" | "cachorro";
  breed?: string;
  age: number;
  ageUnit: "meses" | "anos";
  description?: string;
  adoptionStatus: "disponivel" | "adotado";
}

function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarPets() {
      try {
        const resposta = await apiRequest("/api/pets");

        if (!Array.isArray(resposta)) {
          throw new Error("Resposta inválida ao carregar os animais.");
        }

        setPets(resposta);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os animais.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarPets();
  }, []);

  const petsFiltrados = pets.filter((pet) => {
    const disponivel = pet.adoptionStatus === "disponivel";

    const correspondeBusca = pet.name
      .toLowerCase()
      .includes(busca.toLowerCase());

    const correspondeCategoria =
      categoria === "todos" || pet.species === categoria;

    return disponivel && correspondeBusca && correspondeCategoria;
  });

  function formatarIdade(pet: Pet) {
    if (pet.ageUnit === "meses") {
      return `${pet.age} ${pet.age === 1 ? "mês" : "meses"}`;
    }

    return `${pet.age} ${pet.age === 1 ? "ano" : "anos"}`;
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-header-top">
          <h1>
            We<span>Pet</span>
          </h1>

          <button
            type="button"
            className="home-conversas-btn"
            onClick={() => navigate("/conversas")}
          >
            💬 Minhas conversas
          </button>
        </div>

        <p>Encontre seu novo melhor amigo!</p>
      </header>

      <section className="home-content">
        <div className="home-search">
          <input
            type="search"
            placeholder="Buscar por nome do animal..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <div className="home-categories">
          <button
            type="button"
            className={categoria === "todos" ? "ativo" : ""}
            onClick={() => setCategoria("todos")}
          >
            Todos
          </button>

          <button
            type="button"
            className={categoria === "gato" ? "ativo" : ""}
            onClick={() => setCategoria("gato")}
          >
            Gatos
          </button>

          <button
            type="button"
            className={categoria === "cachorro" ? "ativo" : ""}
            onClick={() => setCategoria("cachorro")}
          >
            Cachorros
          </button>
        </div>

        <h2>Encontre seu companheiro</h2>

        {carregando && <p>Carregando animais...</p>}

        {!carregando && erro && <p className="home-error">{erro}</p>}

        {!carregando && !erro && petsFiltrados.length > 0 && (
          <div className="pets-grid">
            {petsFiltrados.map((pet) => (
              <article
                className="pet-card"
                key={pet._id}
                onClick={() => navigate(`/pet/${pet._id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="pet-image-placeholder">
                  {pet.species === "gato" ? "🐱" : "🐶"}
                </div>

                <div className="pet-card-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed || "Raça não informada"}</p>
                  <span>{formatarIdade(pet)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!carregando && !erro && petsFiltrados.length === 0 && (
          <p>Nenhum animal encontrado.</p>
        )}
      </section>
    </main>
  );
}

export default Home;
