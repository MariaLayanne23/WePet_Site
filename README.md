# 🐾 WePet — Plataforma de Adoção de Animais

O **WePet** é uma plataforma web desenvolvida para conectar pessoas interessadas em adotar animais a protetores responsáveis por disponibilizá-los para adoção.

A aplicação busca facilitar o processo de adoção responsável, oferecendo um ambiente para visualizar animais disponíveis, consultar suas informações e estabelecer comunicação entre adotantes e protetores.

🌐 **Acesse a plataforma:** https://we-pet-site.vercel.app/

**Grupo do projeto:**

- Maria Layanne
- Vinícius Matheus
- Fabio Fernandes
- Gustavo Santos França

---

## 🎯 Objetivo

Desenvolver uma solução tecnológica que facilite a conexão entre adotantes e protetores, tornando o processo de adoção mais acessível, organizado e interativo.

## ✨ Funcionalidades

- Cadastro de usuários com perfis de adotante e protetor.
- Autenticação e login com JWT.
- Visualização dos animais disponíveis para adoção.
- Consulta de informações individuais dos animais.
- Criação de conversas entre adotantes e protetores.
- Envio e recebimento de mensagens em tempo real.
- Armazenamento das mensagens no banco de dados.
- Recuperação do histórico de conversas após novo acesso.
- Identificação dos participantes das conversas.

## 🛠️ Tecnologias utilizadas

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- CSS
- Socket.IO Client

### Backend
- Node.js
- Express 5
- JavaScript
- Socket.IO
- JSON Web Token (JWT)
- BcryptJS
- Mongoose

### Banco de dados
- MongoDB Atlas

### Hospedagem
- **Vercel:** hospedagem do frontend.
- **Render:** hospedagem do backend.
- **MongoDB Atlas:** armazenamento dos dados.

## 🏗️ Arquitetura da aplicação

O WePet utiliza uma arquitetura dividida em três partes principais:

**Frontend:** desenvolvido em React e TypeScript, responsável pela interface e interação com os usuários.

**Backend:** desenvolvido em Node.js e Express, responsável pelas regras de negócio, autenticação, gerenciamento das rotas e comunicação em tempo real.

**Banco de dados:** MongoDB Atlas, responsável pelo armazenamento das informações dos usuários, animais, conversas e mensagens.

### Comunicação em tempo real

A comunicação entre os participantes utiliza Socket.IO.

O envio das mensagens é realizado por meio da API, que armazena os registros no MongoDB e utiliza Socket.IO para transmitir as novas mensagens aos participantes conectados à conversa.

Dessa forma, o histórico permanece disponível mesmo após atualizar a página ou realizar um novo login.

## 📁 Estrutura do projeto

```text
WePet_Site/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── WePet/
│   └── frontend/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── App.tsx
│       │   └── main.tsx
│       │
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json
│
├── consultas/
│
└── .gitignore
