import { elements } from "./base";

const createShopList = (item) => {
	const markup = `
        <li class="shopping__item" data-id="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
	elements.shopList.insertAdjacentHTML("beforeend", markup);
};
export const renderShopList = (items) => items.forEach(createShopList);

export const deleteShopList = (id) => {
	const target = document.querySelector(`.shopping__item[data-id="${id}"`);
	target.parentElement.removeChild(target);
};
