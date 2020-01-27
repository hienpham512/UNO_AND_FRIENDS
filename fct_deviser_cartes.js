"use strict";

const fs = require("fs");

function deviser_cartes (cartes_complet, nombres_joueur){
	let i;
	let j;
	let liste_cartes_deviser = [];

	for(i = 0; i < nombres_joueur; i++){
		const list_cards = [];
		for(j = 0; j < 7; j++){
			list_cards.push(cartes_complet.pop());
		}
		liste_cartes_deviser.push(list_cards);
	}

	liste_cartes_deviser.push(cartes_complet);
	return liste_cartes_deviser;
};
/*let a = fs.readFileSync("cartes_complet.json","utf-8");
let b = JSON.parse(a);
let n = 2;
let c  = deviser_cartes(b,n);
console.log(c);
console.log(c[2].length);*/

module.exports = deviser_cartes;

