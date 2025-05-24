import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}
