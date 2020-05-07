import axios from "axios";

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		try {
			const response = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
			this.query = response.data.recipes;
		} catch (error) {
			alert(`Doesn't exist recipes in that keyword
            "${error}"`);
		}
	}
}
