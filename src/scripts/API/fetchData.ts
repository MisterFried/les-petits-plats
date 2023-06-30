import { Recipe } from "../interfaces/interfaces";

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
