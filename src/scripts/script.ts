import { fetchRecipes } from "./API/fetchData";
import { displayRecipes } from "./features/displayRecipes";
import { dropdown } from "./features/dropdown";
import { searchRecipes } from "./features/searchFilter";
import { FilterList, Recipe } from "./interfaces/interfaces";

async function pageInitialization() {
	// * Fetch the recipes list
	const recipesList = await fetchRecipes();

	if (recipesList) {
		const filterList: FilterList = { ingredients: [], appliance: [], ustensils: [] }; // List of active filters
		const initialSearchedRecipesList: Array<Recipe> = [];
		// * Initially display all the recipes
		displayRecipes(recipesList, filterList, true, initialSearchedRecipesList);
		// * Setup the search functionnality
		searchRecipes(recipesList, filterList);
	}
}

pageInitialization();
dropdown();
