import {parseYaml, Plugin, TFile} from "obsidian";
import {InvalidCard} from "./invalid-card";
import {NeteaseMusicCard} from "./netease-music-card";
import {RecipeCard} from "./recipe-card";
import InvalidFormatError from "./errors";

export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("coded-card", (source, el, ctx) => {
			try {
				const metadata = JSON.parse(source);
				switch (metadata.type) {
					case "netease-music":
						el.replaceWith(new NeteaseMusicCard(el, metadata.meta).elem);
						break;
					case "recipe":
						(async () => {
							const frontMatterSource = RegExp(/^\n*---[^\n]*\n+(?<fm>.+?)\n+---.*/s).exec(await this.app.vault.cachedRead(<TFile>this.app.vault.getAbstractFileByPath(ctx.sourcePath)))?.groups?.fm;

							try {
								const frontMatter = parseYaml(frontMatterSource!);
								el.replaceWith(new RecipeCard(el, frontMatter, this.app.vault).elem);
							} catch (e) {
								el.replaceWith(new InvalidCard(el, new InvalidFormatError("Invalid FrontMatter Recipe Error", e.stack)).elem)
								console.error(e);
							}
						})();
						break;
				}
			} catch (e) {
				el.replaceWith(new InvalidCard(el, e).elem);
				console.error(e);
			}
		});
	}
}
