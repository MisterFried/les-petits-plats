import { fetchRecipes } from "./API/fetchData";
import { displayRecipes } from "./features/displayRecipes";
import { searchFunction } from "./features/searchFunction";

async function pageInitialization() {
	// * Fetch the recipes list
	const recipesList = await fetchRecipes();

	if (recipesList) {
		// * Initially display all the recipes
		displayRecipes(recipesList);
		// * Setup the search functionnality
		searchFunction(recipesList);
	}
}

pageInitialization();
