// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

// 1. Define the User interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

// 2. Define the Schema
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Only 'user' can register
});

// 3. Pre-save hook to hash password before saving
UserSchema.pre('save', async function () {
  const user = this;

  // Only hash if the password field is modified (e.g., on registration or password change)
  if (!user.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// 4. Method to compare password (for login)
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5. Export the Model
export const User = model<IUser>('User', UserSchema);