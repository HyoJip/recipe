import uniqid from "uniqid";

export default class Shop {
	constructor() {
		this.list = [];
	}

	addItem(count, unit, ingredient) {
		const item = {
			id: uniqid(),
			count: count.toFixed(1),
			unit,
			ingredient,
		};
		this.list.push(item);
	}

	deleteItem(id) {
		this.list = this.list.filter((el) => el.id !== id);
	}

	updateCount(id, newCount) {
		this.list.find((el) => el.id === id).count = newCount;
	}
}
