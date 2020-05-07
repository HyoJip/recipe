export default class Like {
	constructor() {
		this.list = [];
	}

	addItem(id, title, publisher, image) {
		const item = {
			id,
			title,
			publisher,
			image,
		};

		this.list.push(item);
	}

	deleteItem(id) {
		this.list = this.list.filter((el) => el.id !== id);
	}

	loadItem() {
		const parsedLikes = JSON.parse(localStorage.getItem("likes"));
		if (parsedLikes) this.list = parsedLikes;
	}

	saveItem() {
		localStorage.setItem("likes", JSON.stringify(this.list));
	}

	getLength() {
		return this.list.length;
	}

	isLiked(id) {
		return this.list.findIndex((el) => el.id === id) !== -1;
	}
}
