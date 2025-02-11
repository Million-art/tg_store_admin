import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  description?: string;
  category?:Category
}
