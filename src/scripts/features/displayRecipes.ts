import { FilterList, Recipe } from "../interfaces/interfaces";
import { clearDropdown, fillDropdown } from "./dropdown";

/*
Clear all the previously displayed recipes and update with the one contained
in the recipesList.
If it's the first time displaying or updating after a word search by the user
save the content of the RecipesList in initialRecipesList
*/
export function displayRecipes(
	recipesList: Array<Recipe>,
	filterList: FilterList,
	saveInitialRecipesList: boolean,
	initialRecipesList: Array<Recipe>
) {
	const recipesSection = document.querySelector(".recipes");
	const recipesNumber = document.querySelector(".filter__recipes-number") as HTMLSpanElement;

	// * Clear the previous recipes before displaying new ones
	while (recipesSection?.firstChild) {
		recipesSection.firstChild.remove();
	}

	// * Message if no recipes corresponds to the research
	if (recipesList.length === 0) {
		const message = document.createElement("span");
		message.innerText = "Aucune recette correspondante !";
		recipesSection?.appendChild(message);
	}

	if (saveInitialRecipesList) {
		initialRecipesList = recipesList;
	}

	// * Display recipes
	recipesList.forEach(recipe => {
		const recipeCard = createRecipeCard(recipe);
		recipesSection?.appendChild(recipeCard);
	});

	// * Number of recipes indicator
	recipesList.length === 1
		? (recipesNumber.innerText = `${recipesList.length} Recette`)
		: (recipesNumber.innerText = `${recipesList.length} Recettes`);

	// * Update the content of the dropdown menus to correspond to the remaining displayed recipes
	clearDropdown();
	fillDropdown(recipesList, filterList, initialRecipesList);
}

// * Create an "article" element containing the recipe and returns it
function createRecipeCard(recipe: Recipe) {
	const recipeCard = document.createElement("article");
	recipeCard.classList.add("recipe-card");
	recipeCard.tabIndex = 0;

	const recipeImage = document.createElement("img");
	recipeImage.src = `/images/recettes/${recipe.image}`;
	recipeImage.classList.add("recipe-card__image");

	const recipeDuration = document.createElement("span");
	recipeDuration.classList.add("recipe-card__duration");
	recipeDuration.innerText = `${recipe.time} min`;

	const recipeName = document.createElement("h3");
	recipeName.innerText = recipe.name;
	recipeName.classList.add("recipe-card__name");

	const recipeText = document.createElement("h4");
	recipeText.innerText = "RECETTE";
	recipeText.classList.add("recipe-card__recipe-text");

	const recipeDescription = document.createElement("p");
	recipeDescription.innerText = recipe.description;
	recipeDescription.classList.add("recipe-card__description");

	const recipeDescriptionContainer = document.createElement("div");
	recipeDescriptionContainer.append(recipeText, recipeDescription);
	recipeDescriptionContainer.classList.add("recipe-card__description-container");

	const ingredientText = document.createElement("h4");
	ingredientText.innerText = "INGRÉDIENTS";
	ingredientText.classList.add("recipe-card__ingredient-text");

	const recipeIngredientsContainer = document.createElement("ul");
	recipeIngredientsContainer.append(ingredientText);
	recipeIngredientsContainer.classList.add("recipe-card__ingredients-container");

	recipe.ingredients.forEach(ingredient => {
		const ingredientContainer = document.createElement("li");
		ingredientContainer.classList.add("recipe-card__ingredient-container");

		const ingredientName = document.createElement("span");
		ingredientName.innerText = ingredient.ingredient;
		ingredientName.classList.add("recipe-card__ingredient-name");

		ingredientContainer.append(ingredientName);
		if (ingredient.quantity) {
			const ingredientQuantity = document.createElement("span");
			ingredientQuantity.innerText = ingredient.quantity.toString();
			ingredientQuantity.classList.add("recipe-card__ingredient-quantity");
			if (ingredient.unit) {
				ingredientQuantity.innerText += ` ${ingredient.unit}`;
			}
			ingredientContainer.append(ingredientQuantity);
		}
		recipeIngredientsContainer.append(ingredientContainer);
	});

	const recipeTextContent = document.createElement("div");
	recipeTextContent.append(recipeName, recipeDescriptionContainer, recipeIngredientsContainer, recipeDuration);
	recipeTextContent.classList.add("recipe-card__text-content");

	recipeCard.append(recipeImage, recipeTextContent);

	return recipeCard;
}
