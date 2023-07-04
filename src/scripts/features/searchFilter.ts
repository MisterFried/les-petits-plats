import { FilterList, Recipe } from "../interfaces/interfaces";
import { displayRecipes } from "./displayRecipes";
import { clearTags } from "./dropdown";

export function searchRecipes(recipesList: Array<Recipe>, filterList: FilterList) {
	// * User search input element
	const searchInputElement = document.querySelector("#header__input") as HTMLInputElement;
	const resetSearchElement = document.querySelector(".header__reset-search");

	// * Event listener to get the user input when input is 3 + characters long
	searchInputElement?.addEventListener("input", () => {
		clearTags(filterList);
		if (searchInputElement.value.length >= 3) {
			const searchInput = normalizeString(searchInputElement.value); // normalize user input

			// * Filter the recipes containing the user input in name / description / ingredients
			const searchedRecipesList = recipesList.filter(recipe => {
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
			displayRecipes(searchedRecipesList, filterList, true, searchedRecipesList); // update with filtered recipes
		} else {
			displayRecipes(recipesList, filterList, true, recipesList);
		}
	});

	resetSearchElement?.addEventListener("click", () => {
		searchInputElement.value = "";
		displayRecipes(recipesList, filterList, true, recipesList);
		clearTags(filterList);
	});
}

// * Filter the recipes depending on the currently selected filters
export function filterRecipes(recipesList: Array<Recipe>, filterList: FilterList) {
	const filteredRecipesList: Array<Recipe> = [];

	if (filterList.ingredients.length === 0 && filterList.appliance.length === 0 && filterList.ustensils.length === 0) {
		return recipesList;
	} else {
		recipesList.forEach(recipe => {
			let containsIngredient = true;
			let containsAppliance = true;
			let containsUstensils = true;

			// * Check if the recipe contains the ingredients
			filterList.ingredients.forEach(ingredient => {
				const recipeIngredientList: Array<string> = [];
				recipe.ingredients.forEach(ingredient => recipeIngredientList.push(ingredient.ingredient));
				if (!recipeIngredientList.includes(ingredient)) containsIngredient = false;
			});

			// * Check if the recipe use the correct appliance
			filterList.appliance.forEach(appliance => {
				if (!recipe.appliance.includes(appliance)) containsAppliance = false;
			});

			// * Check if the recipe containst the ustensils
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

// * normalize the string (remove accent - everything to lower case)
export function normalizeString(string: string) {
	return string
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}
