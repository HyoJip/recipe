export const elements = {
	searchInput: document.querySelector(".search__field"),
	searchForm: document.querySelector(".search"),
	searchList: document.querySelector(".results__list"),
	serachPageBtn: document.querySelector(".results__pages"),
	recipeContainer: document.querySelector(".recipe"),
	shopList: document.querySelector(".shopping__list"),
	likeList: document.querySelector(".likes__list"),
	likeMenu: document.querySelector(".likes__field"),
};

export const renderLoader = (parent) => {
	const loader = `
		<div class="loader">
			<svg>
				<use href="img/icons.svg#icon-cw"</use>
			</svg>
		</div>`;
	parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
	const loader = document.querySelector(".loader");
	if (loader) loader.parentElement.removeChild(loader);
};
