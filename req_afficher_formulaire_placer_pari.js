"use strict";
const fs = require("fs");
const _supprimer_joueur_rejouer_dans_listes_tables = require('./fct_supprimer_joueurs_terminer_match.js');
const _supprimer_joueur_dans_lobby = require('./fct_supprimer_joueur_dans_lobby.js');
function trait(req,res,query){
	let marqueurs;
	let page;
	_supprimer_joueur_dans_lobby(query.pseudo, query.pari);
	_supprimer_joueur_rejouer_dans_listes_tables(query.table, query.pari,query.pseudo);
	page = fs.readFileSync("modele_afficher_formulaire_placer_pari.html", "utf-8");

	marqueurs = {};
//	marqueurs.erreur = "ERREUR: Pari ou nombre de joueur n'est pas valible, ressayez-vous,svp!";
	marqueurs.pseudo = query.pseudo;
	marqueurs.password = query.password;
	marqueurs.pari = query.pari;
	marqueurs.credit = query.credit;
	marqueurs.erreur = '';

	page = page.supplant(marqueurs);

	res.writeHead(200,{'Content-Type':'text/html'});
	res.write(page);
	res.end();
}

module.exports = trait;
