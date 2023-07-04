import { fetchRecipes } from "./API/fetchData";
import { displayRecipes } from "./features/displayRecipes";
import { dropdown } from "./features/dropdown";
import { searchRecipes } from "./features/research";
import { FilterList, Recipe } from "./interfaces/interfaces";

/*
How it works :

-- > Page initialization
	- Fetching the file containing all the recipes
	- Display all the recipes
	- Setup the research functionnality
	- Setup the dropdown menus (filter)

Two use cases :
- The user search specific words
--> Recipes corresponding to the words are displayed
--> The filter are applied on the remaining results from the research

- The user do not research anything
--> All the recipes are displayed
--> The filter are applied on the full list of recipes

The filterList object contains all the active filter and is updated 
everytime a filter is added / removed.
The initialRecipeList Array contains the results of the research 
or by default all the recipes if the user did not researched anything.
*/

async function pageInitialization() {
	const recipesList = await fetchRecipes(); // Fetch the recipes

	if (recipesList) {
		const filterList: FilterList = { ingredients: [], appliance: [], ustensils: [] };
		const initialRecipesList: Array<Recipe> = recipesList;

		displayRecipes(recipesList, filterList, true, initialRecipesList);
		searchRecipes(recipesList, filterList);
	}
}

pageInitialization();
dropdown();
