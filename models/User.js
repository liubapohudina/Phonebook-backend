import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";
import { emailRegepxp } from "../constants/constUser.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      match: emailRegepxp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
      avatarURL: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
  },
  { versionKey: false }
);

userSchema.post("save", handleSaveError);
const User = model('user', userSchema);

export default User;