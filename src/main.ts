import {Plugin} from "obsidian";
import {InvalidCard} from "./invalid-card";
import {NeteaseMusicCard} from "./netease-music-card";

export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("coded-card", (source, el, _) => {
			try {
				const metadata = JSON.parse(source);
				switch (metadata.type) {
					case "netease-music":
						el.replaceWith(new NeteaseMusicCard(el, metadata.meta).elem);
						break;
				}
			} catch (e) {
				el.replaceWith(new InvalidCard(el, e).elem);
				console.error(e);
			}
		});
	}
}
