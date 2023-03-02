const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const slugify = require("slugify");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    dateOfBirth: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.username, { lower: true });
  }
  next();
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SERECT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("Users", userSchema);
