import { fetchRecipes } from "./API/fetchData";
import { Recipe } from "./interfaces/interfaces";

async function displayRecipes() {
	const recipes = await fetchRecipes();

	if (recipes) {
		const recipesSection = document.querySelector(".recipes");

		recipes.forEach(recipe => {
			const recipeCard = createRecipeCard(recipe);
			recipesSection?.appendChild(recipeCard);
		});
	} else {
		console.error("Error : recipes undefined");
	}
}

function createRecipeCard(recipe: Recipe) {
	const recipeCard = document.createElement("article");
	recipeCard.classList.add("recipe-card");
	recipeCard.tabIndex = 0;

	const recipeImage = document.createElement("img");
	recipeImage.src = `/images/recettes/${recipe.image}`;
	recipeImage.classList.add("recipe-card__image");

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
	recipeTextContent.append(recipeName, recipeDescriptionContainer, recipeIngredientsContainer);
	recipeTextContent.classList.add("recipe-card__text-content");

	recipeCard.append(recipeImage, recipeTextContent);

	return recipeCard;
}

displayRecipes();
