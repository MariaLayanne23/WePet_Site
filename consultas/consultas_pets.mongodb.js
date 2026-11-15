use("WePetDB");

db.getCollection("pets")
  .find(
    {},
    {
      _id: 1,
      name: 1,
      species: 1,
      breed: 1,
      protectorId: 1,
      adoptionStatus: 1,
    },
  )
  .sort({ name: 1 });
