const mongoose = require('mongoose');

const playersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    club: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    position: {
      type: String,
      required: true,
    },
    goals: {
      type: Number,
      required: true,
    },
    isCaptain: {
      type: Boolean,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Players", playersSchema);