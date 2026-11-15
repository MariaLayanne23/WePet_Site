use("WePetDB");

// Consultar todas as mensagens
db.getCollection("messages").find(
  {},
  {
    _id: 1,
    chatId: 1,
    senderId: 1,
    text: 1,
    sentAt: 1,
  },
);
