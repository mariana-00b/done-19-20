import { ICategory } from "../category/category.interface";

export interface IProduct {
	category: ICategory;
	name: string;
	description: string;
	price: number;
	image: string;
	id?: string | number;
}