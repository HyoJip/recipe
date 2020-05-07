import { elements, renderLoader, clearLoader } from "./views/base";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import Shop from "./models/Shop";
import Like from "./models/Like";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shopView from "./views/shopView";
import * as likeView from "./views/likeView";

////////////////////// GLOBAL STATE OF APP
// state.search <--- Search Object
// state.recipe <--- Recipe Object
// state.shop   <--- Shop Object
// state.like   <--- Like Object

const state = {};

////////////////////// SEARCH CONTROLLER
const handleSearchSubmit = async () => {
	// 0. Clear outdated stuff
	searchView.clearList();
	searchView.clearButtons();

	// 1. Get value from the input
	const value = searchView.getInput();

	// 2. Create search object into the state
	if (value) {
		state.search = new Search(value);

		// 3. Prepare UI for results
		renderLoader(elements.searchList);
		searchView.clearInput();

		// 4. Search for recipes
		try {
			await state.search.getResults();

			// 5. Render the results on UI
			clearLoader();
			searchView.renderList(state.search.query);
		} catch (error) {
			searchView.clearList();
			searchView.clearButtons();
			alert("There's no recipe. we can't find any recipe. try search another recipe");
			clearLoader();
		}
	}
};

const controlPageBtn = (event) => {
	const btn = event.target.closest(".btn-inline");
	if (btn) {
		// Clear outdate item
		searchView.clearList();
		searchView.clearButtons();

		// Render new item
		const goToPage = parseInt(btn.dataset.goto);
		searchView.renderList(state.search.query, goToPage);
	}
};

// EventListener
elements.searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	handleSearchSubmit();
});
elements.serachPageBtn.addEventListener("click", controlPageBtn);
elements.searchList.addEventListener("click", searchView.highlightList);

////////////////////// RECIPE CONTROLLER

const handelHashChange = async () => {
	// 1. Get the hash id from url
	const id = window.location.hash.substr(1);

	if (id) {
		// 2. Prepare for UI change
		recipeView.clearRecipe();
		renderLoader(elements.recipeContainer);

		// 3. Get the query for the item using hash
		state.recipe = new Recipe(id);
		try {
			await state.recipe.getRecipe();

			// Uniform ingredients
			state.recipe.parseIngredients();

			// Get recipe's time and servings
			state.recipe.getTime();
			state.recipe.getServings();

			// 4. Render Recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe, state.like.isLiked(id));
		} catch (error) {
			clearLoader();
			alert(error);
		}
	}
};

// EventListener
window.addEventListener("hashchange", handelHashChange);
window.addEventListener("load", handelHashChange);
elements.recipeContainer.addEventListener("click", (event) => {
	const btn_minus = event.target.matches(".btn-minus, .btn-minus *"),
		btn_plus = event.target.matches(".btn-plus, .btn-plus *"),
		btn_add = event.target.matches(".recipe__btn, .recipe__btn *"),
		btn_like = event.target.matches(".recipe__love, .recipe__love *");

	if (btn_minus) {
		state.recipe.updateServings("minus");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (btn_plus) {
		state.recipe.updateServings("plus");
		recipeView.updateServingsIngredients(state.recipe);
	} else if (btn_add) {
		handleAddBtnClick();
	} else if (btn_like) {
		handleLikeBtnClick();
	}
});

////////////////////// SHOP CONTROLLER

const handleAddBtnClick = () => {
	if (!state.shop) state.shop = new Shop();

	// 1. Add each item into Shop object
	state.recipe.ingredients.forEach((el) => {
		state.shop.addItem(el.count, el.unit, el.ingredient);
	});

	// 2. Render each item on UI
	shopView.renderShopList(state.shop.list);
};

// EVENT LINTENER
elements.shopList.addEventListener("click", (event) => {
	const id = event.target.closest(".shopping__item").dataset.id;
	const btn_del = event.target.matches(".shopping__delete, .shopping__delete *"),
		btn_count = event.target.matches(".shopping__count input");

	// Delete button click
	if (btn_del) {
		state.shop.deleteItem(id);
		shopView.deleteShopList(id);
	}
	// Count button click
	else if (btn_count) {
		const newCount = event.target.value;
		state.shop.updateCount(id, newCount);
	}
});

////////////////////// LIKE CONTROLLER

const handleLikeBtnClick = () => {
	const item = state.recipe;

	// WAS liked
	if (state.like.isLiked(item.id)) {
		// 1. Toggle like icon
		likeView.toggleLikeButton(true);

		// 2. Delete item from like object
		state.like.deleteItem(item.id);
		likeView.deleteLikeList(item.id);
	}
	// NOT liked
	else {
		// 1. Toggle like icon
		likeView.toggleLikeButton(false);

		// 2. Add like Item
		state.like.addItem(item.id, item.title, item.publisher, item.image);
		likeView.renderLikeList(item);
		// Save in LOCAL_STORAGE
	}
	// Toggle like menu
	likeView.toggleLikeMenu(state.like.getLength());
	state.like.saveItem();
};

// EVENT LISTENER
window.addEventListener("load", () => {
	state.like = new Like();

	// 1. Load data from LOCAL_STORAGE
	state.like.loadItem();

	// 2. render like item
	likeView.toggleLikeMenu(state.like.getLength());
	state.like.list.forEach(likeView.renderLikeList);
});
