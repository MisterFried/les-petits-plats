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
		// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		// * Alternate filter version using for loops instead of forEach / filter
		// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
		// * Check if the recipe contains the ingredients
		for (let i = 0; i < recipesList.length; i++) {
			let containsIngredient = false;
			let containsAppliance = false;
			let containsUstensils = false;

			// ingredients
			if (filterList.ingredients.length > 0) {
				for (let j = 0; j < filterList.ingredients.length; j++) {
					for (let k = 0; k < recipesList[i].ingredients.length; k++) {
						if (recipesList[i].ingredients[k].ingredient === filterList.ingredients[j])
							containsIngredient = true;
					}
				}
			} else containsIngredient = true;

			// Appliance
			if (filterList.appliance.length > 0) {
				for (let j = 0; j < filterList.appliance.length; j++) {
					if (recipesList[i].appliance === filterList.appliance[j]) containsAppliance = true;
				}
			} else containsAppliance = true;

			// Ustensils
			if (filterList.ustensils.length > 0) {
				for (let j = 0; j < filterList.ustensils.length; j++) {
					for (let k = 0; k < recipesList[i].ustensils.length; k++) {
						if (recipesList[i].ustensils[k] === filterList.ustensils[j]) containsUstensils = true;
					}
				}
			} else containsUstensils = true;
			if (containsIngredient && containsAppliance && containsUstensils) filteredRecipesList.push(recipesList[i]);
		}
		return filteredRecipesList;
	}
}
