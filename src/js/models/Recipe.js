import axios from "axios";

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.publisher = result.data.recipe.publisher;
			this.image = result.data.recipe.image_url;
			this.ingredients = result.data.recipe.ingredients;
			this.title = result.data.recipe.title;
			this.url = result.data.recipe.source_url;
		} catch (error) {
			alert("we can't find the specific recipe information. sorry :(");
		}
	}

	getServings() {
		this.servings = 4;
	}

	getTime() {
		this.time = Math.round((this.ingredients.length / 3) * 15);
	}

	parseIngredients() {
		const unitLong = [
				"tablespoons",
				"tablespoon",
				"ounces",
				"ounce",
				"teaspoons",
				"teaspoon",
				"cups",
				"pounds",
			],
			unitshort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"],
			units = [...unitshort, "kg", "g"];

		const newIngredients = this.ingredients.map((el) => {
			// Uniform the units
			let ingredient = el.trim().toLowerCase();
			unitLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitshort[i]);
			});

			// Remove the parenthese
			ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

			// Parse ingredients into count, unit ingredient
			const arrIng = ingredient.split(" ");
			const unitIndex = arrIng.findIndex((el) => units.includes(el));
			let objIng;
			if (unitIndex > -1) {
				// Unit exist
				const arrCount = arrIng.slice(0, unitIndex);

				// 2 1/2 ==> 2 + 0.5 => 2.5     // 1/2 ==> 0.5      // butter ==> 1 butter
				let count = arrCount.length === 1 ? eval(arrCount[0]) : eval(arrCount.join("+"));
				if (!count) count = 1;

				objIng = {
					count,
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(" "),
				};
			} else if (parseInt(arrIng[0])) {
				// Unit NOT exist BUT First letter is number
				const wordStartIndex = arrIng.findIndex((el) => el.match(/^[^\d]+/));
				const arrCount = arrIng.slice(0, wordStartIndex);
				const count = arrCount.length === 1 ? eval(arrCount[0]) : eval(arrCount.join("+"));
				objIng = {
					count,
					unit: arrIng[wordStartIndex],
					ingredient: arrIng.slice(wordStartIndex + 1).join(" "),
				};
			} else {
				// Unit NOT exist and First letter is NAN
				objIng = {
					count: 1,
					unit: "",
					ingredient,
				};
			}
			return objIng;
		});
		this.ingredients = newIngredients;
	}

	updateServings(type) {
		// Servings
		const newServings = type === "plus" ? this.servings + 1 : this.servings - 1;

		if (newServings > 0) {
			// Ingredients
			this.ingredients.forEach((el) => {
				el.count *= newServings / this.servings;
			});
			this.servings = newServings;
		}
	}
}
