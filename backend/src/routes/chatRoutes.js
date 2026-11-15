const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Chat = require("../models/Chat");
const Pet = require("../models/Pet");
const autenticar = require("../middlewares/authMiddleware");

// Listar somente as conversas do usuário autenticado
router.get("/", autenticar, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.usuario.id,
    })
      .populate("petId")
      .populate("participants");

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar conversas.",
      erro: error.message,
    });
  }
});

// Criar uma conversa com o protetor do animal
router.post("/", autenticar, async (req, res) => {
  try {
    const { petId } = req.body;
    const usuarioId = req.usuario.id;

    if (req.usuario.role !== "adotante") {
      return res.status(403).json({
        mensagem: "Somente adotantes podem iniciar conversas.",
      });
    }

    if (!petId || !mongoose.isValidObjectId(petId)) {
      return res.status(400).json({
        mensagem: "ID do animal inválido.",
      });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    if (pet.adoptionStatus !== "disponivel") {
      return res.status(400).json({
        mensagem: "Este animal não está disponível para adoção.",
      });
    }

    const protetorId = pet.protectorId.toString();

    if (protetorId === usuarioId) {
      return res.status(400).json({
        mensagem: "Você não pode iniciar uma conversa com sua própria conta.",
      });
    }

    // Verifica se já existe uma conversa entre essas pessoas
    const conversaExistente = await Chat.findOne({
      petId: pet._id,
      participants: {
        $all: [usuarioId, protetorId],
        $size: 2,
      },
    });

    if (conversaExistente) {
      return res.json({
        mensagem: "Você já possui uma conversa sobre este animal.",
        chat: conversaExistente,
      });
    }

    const chat = await Chat.create({
      petId: pet._id,
      participants: [usuarioId, protetorId],
    });

    return res.status(201).json({
      mensagem: "Conversa criada com sucesso!",
      chat,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar conversa.",
      erro: error.message,
    });
  }
});

module.exports = router;
