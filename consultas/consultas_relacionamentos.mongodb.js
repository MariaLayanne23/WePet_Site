use("WePetDB");

db.getCollection("messages").aggregate([
  // Buscar o usuário que enviou a mensagem
  {
    $lookup: {
      from: "users",
      localField: "senderId",
      foreignField: "_id",
      as: "remetente",
    },
  },

  // Buscar a conversa relacionada
  {
    $lookup: {
      from: "chats",
      localField: "chatId",
      foreignField: "_id",
      as: "conversa",
    },
  },

  // Buscar o pet associado à conversa
  {
    $lookup: {
      from: "pets",
      localField: "conversa.petId",
      foreignField: "_id",
      as: "pet",
    },
  },

  // Organizar os campos que serão exibidos
  {
    $project: {
      _id: 1,
      text: 1,
      sentAt: 1,
      nomeRemetente: {
        $arrayElemAt: ["$remetente.username", 0],
      },
      chatId: 1,
      nomePet: {
        $arrayElemAt: ["$pet.name", 0],
      },
    },
  },
]);
