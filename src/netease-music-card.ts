import {netease_music_icon} from "../icons/netease-music";

export class NeteaseMusicCard {
	elem: HTMLElement;
	meta: NeteaseMusicSongModel;

	constructor(el: HTMLElement, meta: string) {
		const musicCard = document.createElement("div");
		musicCard.classList.add("netease-music-card", "coded-card");
		this.meta = new NeteaseMusicSongModel(meta);
		musicCard.innerHTML = `
		<div aria-description="网易云音乐" class="netease-music-card-icon icon icon-fill">${netease_music_icon}</div>
		<div class="netease-music-card-info">
			<a href="https://music.163.com/song?id=${this.meta.id}" class="netease-music-card-title">${this.meta.name}</a>
			<p class="netease-music-card-desc">
				<a href="https://music.163.com/artist?id=${this.meta.artist_id}">${this.meta.artist}</a> (<a href="https://music.163.com/album?id=${this.meta.album_id}">${this.meta.album}</a>)
			</p>
		</div>`;
		el.replaceWith(musicCard);
		this.elem = musicCard;
	}
}

class NeteaseMusicSongModel {
	id: number;
	name: string;
	artist: string;
	artist_id: number;
	album: string;
	album_id: number;

	constructor(_in: string) {
		for (let kv of _in.split(';')) {
			let [k, v] = kv.split('=');
			switch (k) {
				case "id":
					this.id = parseInt(v);
					break;
				case "name":
					this.name = v;
					break;
				case "artist":
					this.artist = v;
					break;
				case "artist_id":
					this.artist_id = parseInt(v);
					break;
				case "album":
					this.album = v;
					break;
				case "album_id":
					this.album_id = parseInt(v);
					break;
			}
		}
	}
}
