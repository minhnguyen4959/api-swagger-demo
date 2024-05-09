import mongoose, { Schema, Document } from 'mongoose';
import {IUser} from "../Types/Iuser";
// Define the schema for the user

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: false},
  password: { type: String, required: true }
});

// Create the Mongoose model for the user
const UserModel = mongoose.model<IUser>('User', userSchema);

export  { UserModel };

