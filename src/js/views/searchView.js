import { elements } from "./base";

const renderRecipe = (recipe) => {
	const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title} image">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

	elements.searchList.insertAdjacentHTML("beforeend", markup);
};

const createButton = (type, currentPage) => {
	if (type === "prev") {
		var direction = "left",
			goToPage = currentPage - 1;
	} else if (type === "next") {
		var direction = "right",
			goToPage = currentPage + 1;
	}

	const markup = `
    <button class="btn-inline results__btn--${type}" data-goto="${goToPage}">
		<span>Page ${goToPage}</span>
		<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${direction}"></use>
		</svg>
	</button>
    `;
	elements.serachPageBtn.insertAdjacentHTML("beforeend", markup);
};

const renderButtons = (page, length, range) => {
	const pages = Math.ceil(length / range);

	if (page === 1 && pages > 1) {
		// Next Button
		createButton("next", page);
	} else if (page < pages) {
		// Both Button
		createButton("prev", page);
		createButton("next", page);
	} else if (page == pages && pages > 1) {
		// Previous Button
		createButton("prev", page);
	}
};

const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	if (title.length > limit) {
		title.split(" ").reduce((prev, curr) => {
			if (prev + curr.length <= limit) {
				newTitle.push(curr);
				return prev + curr.length;
			}
		}, 0);
		return newTitle.join(" ") + "...";
	}
	return title;
};

///////////////////////// EXPORT

export const renderList = (query, page = 1, range = 10) => {
	// Render results of current page
	const start = (page - 1) * range,
		end = page * range;

	query.slice(start, end).forEach(renderRecipe);

	// Render pagination button
	renderButtons(page, query.length, range);
};

export const highlightList = (event) => {
	// Clear highlight effect
	Array.from(elements.searchList.children).forEach((el) => {
		el.firstElementChild.classList.remove("results__link--active");
	});

	// Highlight list
	const target = event.target.closest(".results__link");
	if (target) target.classList.add("results__link--active");
};

export const getInput = () => elements.searchInput.value;

export const clearInput = () => (elements.searchInput.value = "");
export const clearList = () => (elements.searchList.innerHTML = "");
export const clearButtons = () => (elements.serachPageBtn.innerHTML = "");
