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

// * Fetch the recipes.json file
export async function fetchRecipes() {
	try {
		const response = await fetch("/data/recipes.json");
		const responseJSON: Array<Recipe> = await response.json();
		return responseJSON;
	} catch {
		console.log(Error);
	}
}
