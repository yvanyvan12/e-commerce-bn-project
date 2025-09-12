import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  accessToken?: string; // optional if not always set
  userRole?: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessToken: { type: String },
    userRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
