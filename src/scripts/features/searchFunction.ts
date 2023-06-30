import { Recipe } from "../interfaces/interfaces";
import { displayRecipes } from "./displayRecipes";

export function searchFunction(recipesList: Array<Recipe>) {
	// * User search input element
	const searchInputElement = document.querySelector("#header__input") as HTMLInputElement;

	// * Event listener to get the user input when input is 3 + characters long
	searchInputElement.addEventListener("input", () => {
		if (searchInputElement.value.length >= 3) {
			const searchInput = normalizeString(searchInputElement.value); // normalize user input

			// * Filter the recipes containing the user input in name / description / ingredients
			const filteredRecipesList = recipesList.filter(recipe => {
				// Name
				const normalizedRecipeName = normalizeString(recipe.name);
				if (normalizedRecipeName.includes(searchInput)) {
					return true;
				}
				// Description
				const normalizedRecipeDescription = normalizeString(recipe.description);
				if (normalizedRecipeDescription.includes(searchInput)) {
					return true;
				}
				// Ingredient
				if (recipe.ingredients.length > 0) {
					let containsIngredient = false;

					recipe.ingredients.forEach(ingredient => {
						const normalizedIngredientName = normalizeString(ingredient.ingredient);
						if (normalizedIngredientName.includes(searchInput)) {
							containsIngredient = true;
						}
					});
					return containsIngredient;
				}
			});
			displayRecipes(filteredRecipesList); // update with filtered recipes
		}
	});

	// * normalize the string (remove accent - everything to lower case)
	function normalizeString(string: string) {
		return string
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
	}
}
