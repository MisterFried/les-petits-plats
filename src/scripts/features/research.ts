import { FilterList, Recipe } from "../interfaces/interfaces";
import { displayRecipes } from "./displayRecipes";
import { clearTags } from "./dropdown";

/*
Event listener on the text input field :
--> If input length >= 3 => Display the corresponding recipes
--> If input length < 3 => Display all the recipes

Research is based on recipe's name / description / ingredients
*/
export function searchRecipes(recipesList: Array<Recipe>, filterList: FilterList) {
	const searchInputElement = document.querySelector("#header__input") as HTMLInputElement;
	const resetSearchElement = document.querySelector(".header__reset-button");
	const searchbarForm = document.querySelector(".header__searchbar");

	searchInputElement?.addEventListener("input", () => {
		clearTags(filterList); // Reset the filter when changing the search input

		if (searchInputElement.value.length >= 3) {
			const searchInput = normalizeString(searchInputElement.value); // normalize user input

			// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			// * Alternate research version using for loops instead of filter / forEach
			// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			const searchedRecipesList = [];
			for (let i = 0; i < recipesList.length; i++) {
				let recipeCorrespond = false;
				const normalizedRecipeName = normalizeString(recipesList[i].name);
				const normalizedRecipeDescription = normalizeString(recipesList[i].description);
				if (normalizedRecipeName.includes(searchInput)) recipeCorrespond = true; // name search
				if (normalizedRecipeDescription.includes(searchInput)) recipeCorrespond = true; // description search
				if (recipesList[i].ingredients.length > 0) {
					for (let j = 0; j < recipesList[i].ingredients.length; j++) {
						if (normalizeString(recipesList[i].ingredients[j].ingredient).includes(searchInput)) {
							recipeCorrespond = true;
						}
					}
				}
				if (recipeCorrespond) searchedRecipesList.push(recipesList[i]);
			}
			displayRecipes(searchedRecipesList, filterList, true, searchedRecipesList); // display recipes corresponding to the research
		} else {
			displayRecipes(recipesList, filterList, true, recipesList); // display all the recipes
		}
	});

	// * Reset the text input
	resetSearchElement?.addEventListener("click", event => {
		event.preventDefault();
		searchInputElement.value = "";
		clearTags(filterList);
		displayRecipes(recipesList, filterList, true, recipesList);
	});

	// * Prevent page reload when pressing enter inside form
	searchbarForm?.addEventListener("submit", event => event.preventDefault());
}

// * normalize the string (remove accent - everything to lower case)
export function normalizeString(string: string) {
	return string
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}
