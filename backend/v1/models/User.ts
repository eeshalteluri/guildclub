import mongoose, { Schema, Document } from "mongoose";
import UserType from "../types/user";

const FriendSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true }
});

const UserSchema = new mongoose.Schema<UserType>({
  name: { type: String, required: true }, // Name is required
  email: { type: String, required: true, unique: true }, // Email is required and must be unique
  image: { type: String, required: true, default: null }, // Default value for optional fields
  emailverified: { type: Boolean, default: null }, // Allows null values
  username: { type: String, unique: true },
  tasks: { type: [mongoose.Schema.ObjectId], default: [] },
  friends: { type: [FriendSchema], default: [] }, // Subdocument for friends
  groups: { type: [String], default: [] }
});

// Export the model
const User = mongoose.models.User || mongoose.model<UserType>("User", UserSchema);
export default User;
