import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: "admin" | "client";
  googleId?: string;
  phone?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    googleId: { type: String, sparse: true },
    phone: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
