import { Recipe } from "../interfaces/interfaces";

// * Custom dropdown buttons
export function dropdown() {
	document.addEventListener("click", event => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			// * If clicked inside of a dropdown -> do nothing
			if (target.closest(".dropdown-content")) {
				return;
			}

			// * If clicked on a dropdown button -> close all the dropdown and open the clicked one
			if (target.matches(".dropdown-button")) {
				const currentDropdown = target.closest(".dropdown-menu");
				const dropdownList = Array.from(document.querySelectorAll(".dropdown-menu"));
				dropdownList.forEach(dropdown => {
					if (dropdown === currentDropdown) {
						return;
					}
					dropdown.classList.remove("open");
				});
				const dropdownMenu = target.closest(".dropdown-menu");
				dropdownMenu?.classList.toggle("open");
			}

			// * If clicked outside of a dropdown -> close all the dropdown
			if (!target.matches(".dropdown-button")) {
				const dropdownList = Array.from(document.querySelectorAll(".dropdown-menu"));
				dropdownList.forEach(dropdown => dropdown.classList.remove("open"));
			}
		}
	});
}

// * Fill the dropdown menus with the corresponding ingredients / ustensils / appliance
export function fillDropdown(recipesList: Array<Recipe>) {
	const ingredientsDropdown = document.querySelector("#ingredients-dropdown-list");
	const applianceDropdown = document.querySelector("#appliance-dropdown-list");
	const ustensilsDropdown = document.querySelector("#ustensils-dropdown-list");
	const ingredientsList: Array<string> = [];
	const applianceList: Array<string> = [];
	const ustensilsList: Array<string> = [];

	// * Get all the different ingredients from the currently displayed recipes
	recipesList.forEach(recipe => {
		if (recipe.ingredients.length > 0) {
			recipe.ingredients.forEach(ingredient => {
				if (!ingredientsList.includes(ingredient.ingredient)) {
					ingredientsList.push(ingredient.ingredient);
				}
			});
		}
		// * Get all the different appliance from the currently displayed recipes
		if (!applianceList.includes(recipe.appliance)) {
			applianceList.push(recipe.appliance);
		}
		// * Get all the different ustensils from the currently displayed recipes
		if (recipe.ustensils.length > 0) {
			recipe.ustensils.forEach(ustensil => {
				if (!ustensilsList.includes(ustensil)) {
					ustensilsList.push(ustensil);
				}
			});
		}
	});

	// * Order alphabetically
	ingredientsList.sort();
	applianceList.sort();
	ustensilsList.sort();

	// * Fill each dropdown list with its corresponding elements
	ustensilsList.forEach(ustensil => {
		const element = document.createElement("li");
		element.innerText = ustensil;
		ustensilsDropdown?.appendChild(element);
	});
	applianceList.forEach(appliance => {
		const element = document.createElement("li");
		element.innerText = appliance;
		applianceDropdown?.appendChild(element);
	});
	ingredientsList.forEach(ingredient => {
		const element = document.createElement("li");
		element.innerText = ingredient;
		ingredientsDropdown?.appendChild(element);
	});
}

export function clearDropdown() {
	const dropdowns = Array.from(
		document.querySelectorAll("#ingredients-dropdown-list, #appliance-dropdown-list, #ustensils-dropdown-list")
	);
	dropdowns.forEach(dropdown => {
		while (dropdown.firstChild) {
			dropdown.firstChild.remove();
		}
	});
}
