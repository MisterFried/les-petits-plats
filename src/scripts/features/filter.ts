import { FilterList, Recipe } from "../interfaces/interfaces";

/*
Filter the recipes depending on the active filters
Returns a new array with the filtered results
*/
export function filterRecipes(recipesList: Array<Recipe>, filterList: FilterList) {
	const filteredRecipesList: Array<Recipe> = [];

	// Case if there is no filters
	if (filterList.ingredients.length === 0 && filterList.appliance.length === 0 && filterList.ustensils.length === 0)
		return recipesList;
	else {
		recipesList.forEach(recipe => {
			let containsIngredient = true;
			let containsAppliance = true;
			let containsUstensils = true;

			// * Check if the recipe contains the ingredients
			filterList.ingredients.forEach(ingredient => {
				const recipeIngredientList: Array<string> = []; // Array containing the list of the recipe's ingredient name
				recipe.ingredients.forEach(ingredient => recipeIngredientList.push(ingredient.ingredient));
				if (!recipeIngredientList.includes(ingredient)) containsIngredient = false;
			});

			// * Check if the recipe use the correct appliance
			filterList.appliance.forEach(appliance => {
				if (!recipe.appliance.includes(appliance)) containsAppliance = false;
			});

			// * Check if the recipe contains the ustensils
			filterList.ustensils.forEach(ustensil => {
				if (!recipe.ustensils.includes(ustensil)) containsUstensils = false;
			});

			if (containsIngredient && containsAppliance && containsUstensils) {
				filteredRecipesList.push(recipe);
			}
		});
		return filteredRecipesList;
	}
}
