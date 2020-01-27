"use strict";

const fs = require("fs");
require('remedial');
const _ = require("lodash");
const _supprimer_joueur_rejouer_dans_listes_tables = require('./fct_supprimer_joueurs_terminer_match.js');
const _compter_pari = require('./fct_compter_pari.js');
const _supprimer_joueur_dans_lobby = require('./fct_supprimer_joueur_dans_lobby.js');


const trait = function (req, res, query) {

    let marqueurs;
    let pseudo;
    let password;
    let page;
    let membre;
    let contenu_fichier;
    let listeMembres;
    let i;
    let trouve;
    let contenu_tables;
    let tables;
    let table_index = query.table;

    contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
    tables = JSON.parse(contenu_tables);
    _supprimer_joueur_dans_lobby(query.pseudo, query.pari);
    const list_tables_with_pari = _.get(tables, `${query.pari}`);
    if(list_tables_with_pari){
        const table = list_tables_with_pari[table_index];
        _compter_pari(table,query.pari, query.credit, query.pseudo);
        _supprimer_joueur_rejouer_dans_listes_tables(query.table, query.pari,query.pseudo);
    }
    contenu_fichier = fs.readFileSync("membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);


    trouve = false;
    i = 0;
    while (i < listeMembres.length && trouve === false) {
        if (listeMembres[i].pseudo === query.pseudo) {
            if (listeMembres[i].password === query.password) {
                trouve = true;
            }
        }
        i++;
    }

    if (trouve === false) {

        page = fs.readFileSync('modele_accueil.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : compte ou mot de passe incorrect";
        marqueurs.pseudo = query.pseudo;
        page = page.supplant(marqueurs);

    } else {

        page = fs.readFileSync('modele_accueil_membre.html', 'UTF-8');

        marqueurs = {};
        marqueurs.pseudo = query.pseudo;
		    marqueurs.password = listeMembres[i-1].password;
		    marqueurs.credit = listeMembres[i-1].credit;
        page = page.supplant(marqueurs);

    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};
module.exports = trait;




