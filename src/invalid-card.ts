export class InvalidCard {
	elem: HTMLElement;

	constructor(el: HTMLElement, exception: Error) {
		const tipsDiv = document.createElement("div");
		tipsDiv.classList.add("invalid-card-container");
		tipsDiv.createEl("p", {cls: ["invalid-card-tips"], text: "[Coded-Card] ERROR: "});
		tipsDiv.createEl("p", {cls: ["invalid-card-tips-exception-message"], text: exception.message});
		tipsDiv.createEl("p", {cls: ["invalid-card-tips-exception-stack"], text: exception.stack});
		el.replaceWith(tipsDiv);
		this.elem = tipsDiv;
	}
}
