"use strict";
const fs = require("fs");
const shuffle_cartes_complet = require("./fct_shuffle_liste_cartes.js");

function afficher_cartes (){
	let i;
	let j;
	const chiffe = ["+2","skip","I"];
	const special_chiffe = ["+4","joker"];
	const couleur = ["v","b","j","r"];
	let cartes_complet = [];

	for(i = 0; i < couleur.length; i++){
	 	cartes_complet.push({
			chiffe : "0",
			couleur : couleur[i]
		});
	}
	for(i = 1; i < 10; i++){
		for(j = 0; j < couleur.length; j++){
			cartes_complet.push({
				chiffe :`${i}`,
				couleur : couleur[j]
			});
			cartes_complet.push({
				chiffe : `${i}`,
				couleur : couleur[j]
			});
		}
	}
	for(i = 0; i < 3; i++){
		for(j = 0; j < couleur.length; j++){
			cartes_complet.push({
				chiffe : chiffe[i],
				couleur : couleur[j]
			});
			cartes_complet.push({
				chiffe : chiffe[i],
				couleur : couleur[j]
			});
		}
	}
	for(i = 0; i < 2; i++){
		for(j=0; j < 4; j++) {
			cartes_complet.push({
				chiffe : `${special_chiffe[i]}`,
				couleur : "n"
			});
		}
	}
	cartes_complet = shuffle_cartes_complet(cartes_complet);

	let cartes = JSON.stringify(cartes_complet);
	fs.writeFileSync("cartes_complet.json",cartes,"utf-8");
	return cartes_complet;

};

//console.log(afficher_cartes());

module.exports = afficher_cartes;
