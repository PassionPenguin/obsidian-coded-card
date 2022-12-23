import {chef_hat_icon} from "../icons/icons";
import {TFile, Vault} from "obsidian";
import InvalidFormatError from "./errors";

// Create a info card based on frontmatter field `recipe` with the following sub fields:
// - title: the title of the recipe
// - cover: the cover image of the recipe
// - description: the description of the recipe
// - time: the estimated cooking time in the following format "preparation:cooking"
// - difficulty: the difficulty of the recipe
// - deliciousness: the deliciousness of the recipe
// - cuisine: the cuisine of the reciperecipe
// - type: the type of the recipe
// - servings: the number of servings
// - ingredients: a list of ingredients
// - utilities: a list of utilities
// - steps: steps of the recipe
// - tips: tips of the recipe
export class RecipeCard {
	elem: HTMLElement;
	meta: RecipeCardModel;

	constructor(el: HTMLElement, meta: any, vault: Vault) {
		const recipeCard = document.createElement("div");
		recipeCard.classList.add("recipe-card", "coded-card");
		try {
			this.meta = new RecipeCardModel(meta);
		} catch (e) {
			throw new InvalidFormatError("Invalid column(s) format or missing column(s).", e.stack);
		}

		recipeCard.innerHTML = `
	<div aria-description="Chef Hat Icon" class="chef-hat-icon icon icon-stroke">${chef_hat_icon}</div>
	<img alt="${this.meta.title}" class="recipe-card-cover" id="recipe-card-cover">
	<p class="recipe-card-title">${this.meta.title}</p>
	<p class="recipe-card-description">${this.meta.description}</p>
	<div class="recipe-details">
		${[["Type", this.meta.type], ["Cuisine", this.meta.cuisine], ["Prep. Time", this.meta.time[0]], ["Cook. Time", this.meta.time[1]], ["Diff.", this.meta.difficulty], ["Deli.", this.meta.deliciousness], ["Serv.", this.meta.servings]].map(([k, v]) => `<p class="recipe-detail"><span class="recipe-detail-key">${k}</span><span class="recipe-detail-value">${v}</span></p>`).join("")}
	</div>
	<div class="ingredients-and-utilities">
		<div class="recipe-ingredients">
			<div class="section-title">Ingredients</div>
			<ul class="ingredient-list">
				${this.meta.ingredients.map(ingredient => `<li>${ingredient.replace(/:/g, ": ")}</li>`).join("")}
			</ul>
		</div>
		<div class="recipe-utilities">
			<div class="section-title">Utilities</div>
			<ul class="utility-list">
				${this.meta.utilities.map(utility => `<li>${utility}</li>`).join("")}
			</ul>
		</div>
	</div>
	<div class="steps">
		<div class="section-title">Steps</div>
		<div class="step-list">
			${this.meta.steps.map(step => `
			<div class="step">
				<p class="step-title">${step[0]}</p>
				<p class="step-description">
					<ul>${step.slice(1).map(s => "<li>" + s + "</li>").join("")}</ul>
				</p>
			</div>`).join("")}
		</div>
	</div>
	<div class="recipe-tips">
		<div class="section-title">Tips</div>
		<ul class="tips-list">
			${this.meta.tips.map(tips => `<li>${tips}</li>`).join("")}
		</ul>
	</div>
`;
		// Replace the link format of the cover image to blob link.
		(async () => {
			const file = vault.getAbstractFileByPath(this.meta.cover);
			if (!(file instanceof TFile)) {
				throw new Error("Cover image not found.");
			}
			const coverImage = await vault.readBinary(file);
			console.log(file, coverImage);
			recipeCard.find("#recipe-card-cover").setAttr(
				"src",
				URL.createObjectURL(new Blob([coverImage], {type: "image/jpeg"})));
		})();

		el.replaceWith(recipeCard);
		this.elem = recipeCard;
	}
}

// Model of the `RecipeCard`
class RecipeCardModel {
	title: string;
	cover: string;
	description: string;
	time: string[];
	difficulty: string;
	deliciousness: string;
	cuisine: string;
	servings: number;
	type: string;
	ingredients: string[];
	utilities: string[];
	steps: string[][];
	tips: string[];

	constructor(_in: any) {
		this.title = _in.title;
		this.cover = _in.cover;
		this.description = _in.description;
		this.time = `${_in.time}`.split(";");
		this.difficulty = _in.difficulty;
		this.deliciousness = _in.deliciousness;
		this.cuisine = _in.cuisine;
		this.servings = _in.servings;
		this.type = _in.type;
		this.ingredients = _in.ingredients;
		this.utilities = _in.utilities;
		this.steps = _in.steps.map((step: string) => step.split(/- /g));
		this.tips = _in.tips;
	}
}
