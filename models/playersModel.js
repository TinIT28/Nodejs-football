const mongoose = require('mongoose');
const slugify = require("slugify");

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
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    nations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nations",
      require: true,
    },
    nationImage: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

playersSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Players", playersSchema);