const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const schema = mongoose.Schema(
  {
    //essential
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },

    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'user'],
      default: 'user',
  },
  adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
          return this.role === 'user';
      },
  },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", schema);
