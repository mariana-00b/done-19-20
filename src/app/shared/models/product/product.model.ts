import { ICategory } from "../../interfacees/category/category.interface";
import { IProduct } from "../../interfacees/product/product.interface";

export class Product implements IProduct {
	constructor (
		public category: ICategory,
		public name: string,
		public description: string,
		public price: number,
		public image: string,
		public id?: string | number
	) {}
}