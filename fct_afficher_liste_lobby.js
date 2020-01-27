//Création du HTML pour la liste des personnes dans le lobby.

"use strict";

const _ = require("lodash");

function afficher_liste_lobby (lobby, pseudo, pari){
	const list_players = _.get(lobby, `${pari}`);

	if (!list_players) {
		return '';
	}

	let html = "<ul>";

	const player_index = list_players.indexOf(pseudo);

	if (player_index < 0) {
		return '';
	}

	const start_index = player_index - player_index % 8;

	for (let i = 0; i < 8; i++) {
		const current_index = start_index + i;

		if(current_index === list_players.length) {
			break;
		}

		html += `<li>${list_players[current_index]}</li>`;
	}

	html += "</ul>"
	return html;

};

module.exports = afficher_liste_lobby;
