//Création du HTML pour le bouton de démarrage du jeu.

"use strict";

const _ = require('lodash');

function afficher_bouton_demarrer (lobby, pseudo, password, pari, credit){
	const list_players = _.get(lobby, `${pari}`);

	if (!list_players) {
		return '';
	}

	const player_index = list_players.indexOf(pseudo) % 8;

	return player_index % 8 === 0 && list_players.length - player_index > 1
		? `<a href='req_demarrer?pseudo=${pseudo}&password=${password}&pari=${pari}&credit=${credit}' class="button">Démarrer</a>`
		: '';
};

module.exports = afficher_bouton_demarrer;
