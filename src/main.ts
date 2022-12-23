import {Plugin} from "obsidian";
import {InvalidCard} from "./invalid-card";

export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("coded-card", (source, el, _) => {
			try {
				throw(new Error());
			} catch (e) {
				el.replaceWith(new InvalidCard(el, e).elem);
				console.error(e);
			}
		});
	}
}
