import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}
