const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// CADASTRO
router.post("/cadastro", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        mensagem: "Informe e-mail, senha e tipo de conta.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        mensagem: "A senha deve ter pelo menos 8 caracteres.",
      });
    }

    if (!["adotante", "protetor"].includes(role)) {
      return res.status(400).json({
        mensagem: "Tipo de conta inválido.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await User.findOne({
      email: emailNormalizado,
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const usuario = await User.create({
      email: emailNormalizado,
      password: senhaHash,
      role,
    });

    return res.status(201).json({
      mensagem: "Conta criada com sucesso!",
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
      erro: error.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensagem: "Informe e-mail e senha.",
      });
    }

    const usuario = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!usuario) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
      erro: error.message,
    });
  }
});

module.exports = router;
