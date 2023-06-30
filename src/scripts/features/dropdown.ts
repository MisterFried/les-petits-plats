export function dropdown() {
	document.addEventListener("click", event => {
		const target = event.target;

		if (target instanceof HTMLElement) {
			if (target.closest(".dropdown-content")) {
				return;
			}

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

			if (!target.matches(".dropdown-button")) {
				const dropdownList = Array.from(document.querySelectorAll(".dropdown-menu"));
				dropdownList.forEach(dropdown => dropdown.classList.remove("open"));
			}
		}
	});
}
