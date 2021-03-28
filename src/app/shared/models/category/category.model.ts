import { ICategory } from "../../interfacees/category/category.interface";

export class Category implements ICategory {
	constructor (
		public name: string,
		public id?: string | number
	) {}
}