export interface Recipe {
	id: number;
	image: string;
	name: string;
	servings: number;
	ingredients: Array<Ingredient>;
	time: number;
	description: string;
	appliance: string;
	ustensils: Array<string>;
}

export interface Ingredient {
	ingredient: string;
	quantity?: number;
	unit?: string;
}
