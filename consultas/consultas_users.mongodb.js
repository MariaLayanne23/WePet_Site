use("WePetDB");

// Consultar todos os usuários
db.getCollection("users").find(
  {},
  {
    _id: 1,
    name: 1,
    email: 1,
    role: 1,
  },
);
