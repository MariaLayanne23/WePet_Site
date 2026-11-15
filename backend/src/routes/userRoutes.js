const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Listar usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar usuários",
      erro: error.message,
    });
  }
});

module.exports = router;
