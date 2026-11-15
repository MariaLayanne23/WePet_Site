const express = require("express");
const router = express.Router();

const Pet = require("../models/Pet");

// Listar todos os pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar pets",
      erro: error.message,
    });
  }
});

// Buscar um pet pelo ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        mensagem: "Animal não encontrado",
      });
    }

    res.json(pet);
  } catch (error) {
    res.status(400).json({
      mensagem: "ID inválido ou erro ao buscar animal",
      erro: error.message,
    });
  }
});

module.exports = router;
