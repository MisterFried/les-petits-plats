import { FilterList, Recipe } from "../interfaces/interfaces";
import { displayRecipes } from "./displayRecipes";
import { filterRecipes, normalizeString } from "./searchFilter";

// * Custom dropdown buttons with keyboard navigation (tab)
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
					if (dropdown != currentDropdown) {
						// close the other dropdown
						dropdown.classList.remove("open");
						if (dropdown.firstElementChild) {
							KeyboardNav(dropdown.firstElementChild, false);
						}
					} else {
						// open / close the clicked dropdown
						if (currentDropdown.classList.contains("open")) {
							currentDropdown.classList.remove("open");
							KeyboardNav(target, false);
						} else {
							currentDropdown.classList.add("open");
							KeyboardNav(target, true);
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

	const resetButton = document.querySelector(".filter__reset");
	resetButton?.addEventListener("click", () => location.reload());
}

// * Fill the dropdown menus with the corresponding ingredients / ustensils / appliance
export function fillDropdown(
	searchedRecipesList: Array<Recipe>,
	filterList: FilterList,
	initialSearchedRecipesList: Array<Recipe>
) {
	const ingredientsDropdown = document.querySelector("#ingredients-dropdown-list");
	const applianceDropdown = document.querySelector("#appliance-dropdown-list");
	const ustensilsDropdown = document.querySelector("#ustensils-dropdown-list");
	const ingredientsList: Array<string> = [];
	const applianceList: Array<string> = [];
	const ustensilsList: Array<string> = [];

	// * Get all the different ingredients from the currently displayed recipes
	searchedRecipesList.forEach(recipe => {
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
	ingredientsList.forEach(ingredient => {
		const element = document.createElement("li");
		element.innerText = ingredient;
		ingredientsDropdown?.appendChild(element);
		selectFilter(element, "ingredients", filterList, searchedRecipesList, initialSearchedRecipesList);
	});
	applianceList.forEach(appliance => {
		const element = document.createElement("li");
		element.innerText = appliance;
		applianceDropdown?.appendChild(element);
		selectFilter(element, "appliance", filterList, searchedRecipesList, initialSearchedRecipesList);
	});
	ustensilsList.forEach(ustensil => {
		const element = document.createElement("li");
		element.innerText = ustensil;
		ustensilsDropdown?.appendChild(element);
		selectFilter(element, "ustensils", filterList, searchedRecipesList, initialSearchedRecipesList);
	});
}

// * Clear all the previous elements inside the dropdown
export function clearDropdown() {
	const dropdowns = Array.from(document.querySelectorAll(".dropdown-content"));
	dropdowns.forEach(dropdown => {
		while (dropdown.firstElementChild) {
			dropdown.firstElementChild.remove();
		}
	});
}

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
// * Enable / Disable keyboard navigation
function KeyboardNav(target: Element, state: boolean) {
	const dropdownList = target.nextElementSibling?.nextElementSibling;
	const dropdownElementsHTMLCollection = dropdownList?.children;
	if (dropdownElementsHTMLCollection) {
		const dropdownElements = [...dropdownList.children];
		if (state) {
			dropdownElements.forEach(element => element.setAttribute("tabIndex", "0"));
		} else {
			dropdownElements.forEach(element => element.setAttribute("tabIndex", "-1"));
		}
	}
}

// * Event listener to add the clicked element to the list of active filters for the recipes
function selectFilter(
	filter: HTMLElement,
	category: string,
	filterList: FilterList,
	searchedRecipesList: Array<Recipe>,
	initialSearchedRecipesList: Array<Recipe>
) {
	const activeFilterContainer = document.querySelector(".filter__active-filter-container");

	filter.addEventListener("click", () => {
		const filterName = filter.innerText;
		const normalizedFilterName = normalizeString(filterName).replace("'", " ").replace(/\s/g, "-"); // Normalize without space and accent

		if (!filterList[category as keyof typeof filterList].includes(filterName)) {
			// If the filter is not already selected
			const filterElement = document.createElement("span"); // Create the filter tag
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
			filterList[category as keyof typeof filterList].push(filterName);
			const filteredRecipesList = filterRecipes(searchedRecipesList, filterList);
			displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);

			// * Event listener on the remove filter / tag icon
			const closeIcon = document.querySelector(`#${normalizedFilterName}-filter`);
			closeIcon?.addEventListener("click", () => {
				closeIcon.parentElement?.remove();
				filterList[category as keyof typeof filterList].splice(
					filterList[category as keyof typeof filterList].indexOf(filterName),
					1
				);
				const filteredRecipesList = filterRecipes(initialSearchedRecipesList, filterList);
				displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);
			});
		} else {
			// * If clicked again in the dropdown, remove the filter
			const closeIcon = document.querySelector(`#${normalizedFilterName}-filter`);
			closeIcon?.parentElement?.remove();
			filterList[category as keyof typeof filterList].splice(
				filterList[category as keyof typeof filterList].indexOf(filterName),
				1
			);
			const filteredRecipesList = filterRecipes(initialSearchedRecipesList, filterList);
			displayRecipes(filteredRecipesList, filterList, false, initialSearchedRecipesList);
		}
	});
}
