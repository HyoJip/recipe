import { elements } from "./base";

export const renderLikeList = (item) => {
	const markup = `
    <li>
        <a class="likes__link" href="#${item.id}">
            <figure class="likes__fig">
                <img src="${item.image}" alt="${item.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${item.title}</h4>
                <p class="likes__author">${item.publisher}</p>
            </div>
        </a>
    </li>
    `;

	elements.likeList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLikeList = (id) => {
	const item = document.querySelector(`.likes__link[href="#${id}"]`);
	item.parentElement.removeChild(item);
};

export const toggleLikeButton = (isLiked) => {
	const iconString = isLiked ? "-outlined" : "";
	document
		.querySelector(".header__likes use")
		.setAttribute("href", `img/icons.svg#icon-heart${iconString}`);
};

export const toggleLikeMenu = (length) => {
	elements.likeMenu.style.visibility = length > 0 ? "visible" : "hidden";
};
