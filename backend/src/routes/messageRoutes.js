const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Message = require("../models/Message");
const Chat = require("../models/Chat");
const autenticar = require("../middlewares/authMiddleware");

// Listar mensagens das conversas do usuário
router.get("/", autenticar, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.usuario.id,
    }).select("_id");

    const chatIds = chats.map((chat) => chat._id);

    const messages = await Message.find({
      chatId: { $in: chatIds },
    })
      .populate("senderId", "username email")
      .populate("chatId")
      .sort({ sentAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar mensagens.",
      erro: error.message,
    });
  }
});

// Buscar mensagens de uma conversa específica
router.get("/chat/:chatId", autenticar, async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({
        mensagem: "ID da conversa inválido.",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.usuario.id,
    });

    if (!chat) {
      return res.status(404).json({
        mensagem: "Conversa não encontrada.",
      });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "username email")
      .sort({ sentAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar mensagens.",
      erro: error.message,
    });
  }
});

// Enviar uma mensagem
router.post("/", autenticar, async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.usuario.id;

    if (!chatId || !text || !text.trim()) {
      return res.status(400).json({
        mensagem: "Informe a conversa e o texto da mensagem.",
      });
    }

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({
        mensagem: "ID da conversa inválido.",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId,
    });

    if (!chat) {
      return res.status(403).json({
        mensagem: "Você não participa desta conversa.",
      });
    }

    // Salvar mensagem no MongoDB
    const message = await Message.create({
      chatId,
      senderId,
      text: text.trim(),
    });

    // Buscar mensagem com os dados do remetente
    const mensagemCompleta = await Message.findById(message._id).populate(
      "senderId",
      "username email",
    );

    // Transmitir mensagem para os participantes conectados
    const io = req.app.get("io");

    if (io) {
      io.to(chatId).emit("nova_mensagem", mensagemCompleta);
    }

    res.status(201).json({
      mensagem: "Mensagem enviada com sucesso!",
      message: mensagemCompleta,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao enviar mensagem.",
      erro: error.message,
    });
  }
});

module.exports = router;
