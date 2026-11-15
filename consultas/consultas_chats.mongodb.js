use("WePetDB");

// Consultar todas as conversas
db.getCollection("chats").find(
  {},
  {
    _id: 1,
    petId: 1,
    participants: 1,
    createdAt: 1,
  },
);
