const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["gato", "cachorro"],
      required: true,
    },

    breed: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    ageUnit: {
      type: String,
      enum: ["meses", "anos"],
      required: true,
    },

    sex: {
      type: String,
      enum: ["macho", "femea"],
    },

    image: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    adoptionStatus: {
      type: String,
      enum: ["disponivel", "adotado"],
      default: "disponivel",
    },

    protectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Pet", petSchema);
