require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const conectarBanco = require("./config/database");

const User = require("./models/User");
const Chat = require("./models/Chat");

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

// Configurações de CORS
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});

// Disponibiliza o Socket.IO para as rotas
app.set("io", io);

// Autenticação da conexão Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Autenticação necessária."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(decoded.id);

    if (!usuario) {
      return next(new Error("Usuário não encontrado."));
    }

    socket.data.userId = usuario._id.toString();

    next();
  } catch (error) {
    next(new Error("Token inválido ou expirado."));
  }
});

// Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.json({
    mensagem: "API WePet funcionando!",
    status: "online",
  });
});

// Conexões em tempo real
io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  // Entrar em uma sala de conversa
  socket.on("entrar_conversa", async (chatId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return socket.emit("erro_socket", "Conversa inválida.");
      }

      const conversa = await Chat.findOne({
        _id: chatId,
        participants: socket.data.userId,
      });

      if (!conversa) {
        return socket.emit("erro_socket", "Você não participa desta conversa.");
      }

      socket.join(chatId);

      console.log(`Usuário entrou na conversa: ${chatId}`);
    } catch (error) {
      console.error("Erro ao entrar na conversa:", error);
      socket.emit("erro_socket", "Não foi possível entrar na conversa.");
    }
  });

  // Desconectar
  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

// Iniciar servidor
async function iniciarServidor() {
  await conectarBanco();

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

iniciarServidor();
