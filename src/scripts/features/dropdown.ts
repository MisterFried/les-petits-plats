import { FilterList, Recipe } from "../interfaces/interfaces";
import { displayRecipes } from "./displayRecipes";
import { filterRecipes } from "./filter";
import { normalizeString } from "./research";

// * Custom dropdown buttons with keyboard navigation (tab)
export function dropdown() {
	document.addEventListener("click", event => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			// * If clicked inside of a dropdown -> do nothing
			if (target.closest(".dropdown-content")) return;

			// * If clicked on a dropdown button -> close all the dropdown and open the clicked one
			if (target.matches(".dropdown-button")) {
				const currentDropdown = target.closest(".dropdown-menu");
				const dropdownList = Array.from(document.querySelectorAll(".dropdown-menu"));
				dropdownList.forEach(dropdown => {
					if (dropdown === currentDropdown) {
						// Close the clicked dropdown
						if (currentDropdown.classList.contains("open")) {
							currentDropdown.classList.remove("open");
							KeyboardNav(target, false);
						} else {
							// Open the clicked dropdown
							currentDropdown.classList.add("open");
							KeyboardNav(target, true);
						}
					} else {
						// Close the other dropdown
						dropdown.classList.remove("open");
						if (dropdown.firstElementChild) {
							KeyboardNav(dropdown.firstElementChild, false);
						}
					}
				});
			}

			// * If clicked outside of a dropdown -> close all the dropdown
			if (!target.matches(".dropdown-button")) {
				const dropdownList = Array.from(document.querySelectorAll(".dropdown-menu"));
				dropdownList.forEach(dropdown => {
					dropdown.classList.remove("open");
					if (dropdown.firstElementChild) {
						KeyboardNav(dropdown.firstElementChild, false);
					}
				});
			}
		}
	});
}

// * Fill the dropdown menus with ingredients / ustensils / appliance corresponding to the current recipes
export function fillDropdown(RecipesList: Array<Recipe>, filterList: FilterList, initialRecipesList: Array<Recipe>) {
	const ingredientsDropdown = document.querySelector("#ingredients-dropdown-list");
	const applianceDropdown = document.querySelector("#appliance-dropdown-list");
	const ustensilsDropdown = document.querySelector("#ustensils-dropdown-list");
	const ingredientsList: Array<string> = [];
	const applianceList: Array<string> = [];
	const ustensilsList: Array<string> = [];

	// * Get all the different ingredients / appliance / ustensils from the currently displayed recipes
	RecipesList.forEach(recipe => {
		// Ingredients
		if (recipe.ingredients.length > 0) {
			recipe.ingredients.forEach(ingredient => {
				if (!ingredientsList.includes(ingredient.ingredient)) ingredientsList.push(ingredient.ingredient);
			});
		}
		// Appliance
		if (!applianceList.includes(recipe.appliance)) applianceList.push(recipe.appliance);
		// Ustensils
		if (recipe.ustensils.length > 0) {
			recipe.ustensils.forEach(ustensil => {
				if (!ustensilsList.includes(ustensil)) ustensilsList.push(ustensil);
			});
		}
	});

	// * Order alphabetically
	ingredientsList.sort();
	applianceList.sort();
	ustensilsList.sort();

	// * Fill each dropdown list with its corresponding elements and add the event listener on click
	ingredientsList.forEach(ingredient => {
		const element = document.createElement("li");
		element.innerText = ingredient;
		ingredientsDropdown?.appendChild(element);
		selectFilter(element, "ingredients", filterList, RecipesList, initialRecipesList);
	});
	applianceList.forEach(appliance => {
		const element = document.createElement("li");
		element.innerText = appliance;
		applianceDropdown?.appendChild(element);
		selectFilter(element, "appliance", filterList, RecipesList, initialRecipesList);
	});
	ustensilsList.forEach(ustensil => {
		const element = document.createElement("li");
		element.innerText = ustensil;
		ustensilsDropdown?.appendChild(element);
		selectFilter(element, "ustensils", filterList, RecipesList, initialRecipesList);
	});
}

// * Clear all the elements inside the dropdown
export function clearDropdown() {
	const dropdowns = Array.from(document.querySelectorAll(".dropdown-content"));
	dropdowns.forEach(dropdown => {
		while (dropdown.firstElementChild) {
			dropdown.firstElementChild.remove();
		}
	});
}

// * Clear tha tags and reset the filters
export function clearTags(filterList: FilterList) {
	const tagSection = document.querySelector(".filter__active-filter-container");
	while (tagSection?.firstElementChild) {
		tagSection.firstElementChild.remove();
	}
	filterList.ingredients = [];
	filterList.appliance = [];
	filterList.ustensils = [];
}

// TODO ADD THE EVENT LISTENER WHEN PRESSING ENTER OR CHANGE THE ELEMENTS TO BUTTONS INSTEAD OF LI
// * Enable / Disable keyboard navigation on the dropdown contents
function KeyboardNav(target: Element, state: boolean) {
	const dropdownList = target.nextElementSibling?.nextElementSibling;
	const dropdownElementsHTMLCollection = dropdownList?.children;
	if (dropdownElementsHTMLCollection) {
		const dropdownElements = [...dropdownList.children];
		state
			? dropdownElements.forEach(element => element.setAttribute("tabIndex", "0"))
			: dropdownElements.forEach(element => element.setAttribute("tabIndex", "-1"));
	}
}

/* 
Event listener to add the clicked element to the list of active filters for the recipes 
and update the displayed recipes accordingly
*/
function selectFilter(
	dropdownElement: HTMLElement,
	category: string,
	filterList: FilterList,
	searchedRecipesList: Array<Recipe>,
	initialSearchedRecipesList: Array<Recipe>
) {
	const activeFilterContainer = document.querySelector(".filter__active-filter-container");

	dropdownElement.addEventListener("click", () => {
		const filterName = dropdownElement.innerText;
		const normalizedFilterName = normalizeString(filterName).replace("'", " ").replace(/\s/g, "-"); // Normalize without space and accent

		// * If the clicked element is not already an active filter --> add it to the filter list
		if (!filterList[category as keyof typeof filterList].includes(filterName)) {
			// Create the tag element
			const filterElement = document.createElement("span");
			filterElement.innerHTML = `${filterName}
							<svg width="14" height="13" viewBox="0 0 14 13" fill="none" class="active-filter__delete" tabindex="0" id="${normalizedFilterName}-filter">
								<path
									d="M12 11.5L7 6.5M7 6.5L2 1.5M7 6.5L12 1.5M7 6.5L2 11.5"
									stroke="#1B1B1B"
									stroke-width="2.16667"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg>`;
			filterElement.classList.add("active-filter");
			activeFilterContainer?.appendChild(filterElement);

			// Add the selected filter to the filterList object
			filterList[category as keyof typeof filterList].push(filterName);

			// Filter the recipes with the new filterList and display the results
			const filteredRecipesList = filterRecipes(searchedRecipesList, filterList);
			displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);

			// * Event listener to remove the filter / tag
			const closeIcon = document.querySelector(`#${normalizedFilterName}-filter`);
			closeIcon?.addEventListener("click", () => {
				closeIcon.parentElement?.remove();
				// Remove the element from the filterList object
				filterList[category as keyof typeof filterList].splice(
					filterList[category as keyof typeof filterList].indexOf(filterName),
					1
				);

				// Filter the recipes with the new filterList and display the results
				const filteredRecipesList = filterRecipes(initialSearchedRecipesList, filterList);
				displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);
			});
		}

		// * If the clicked element is already an active filter --> remove it from the filter list
		else {
			const closeIcon = document.querySelector(`#${normalizedFilterName}-filter`);
			closeIcon?.parentElement?.remove();
			filterList[category as keyof typeof filterList].splice(
				filterList[category as keyof typeof filterList].indexOf(filterName),
				1
			);

			// Filter the recipes with the new filterList and display the results
			const filteredRecipesList = filterRecipes(initialSearchedRecipesList, filterList);
			displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);
		}
	});
}
