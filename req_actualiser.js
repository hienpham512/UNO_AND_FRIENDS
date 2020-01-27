// Affiche la première page du site.
//req_actualiser

"use strict";

const _ = require("lodash");
const fs = require("fs");
require("remedial");

const afficher_bouton_demarrer = require('./fct_afficher_bouton_demarrer');
const afficher_liste_lobby = require("./fct_afficher_liste_lobby.js");
const afficher_cartes = require("./fct_afficher_cartes.js");
const deviser_cartes = require("./fct_deviser_cartes.js");

function trait(req, res, query) {
  let page;
  let contenu;
  let lobby;
  let marqueurs;
  let contenu_tables;
  let tables;
  // Récupération de la liste des gens déjà en attente.

  contenu = fs.readFileSync("lobby.json", "utf-8");
  lobby = JSON.parse(contenu);

  contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
  tables = JSON.parse(contenu_tables);

  const list_players = _.get(lobby, `${query.pari}`);
  const list_tables = _.get(tables, `${query.pari}`);

  marqueurs = {};
  marqueurs.pseudo = query.pseudo;
  marqueurs.password = query.password;
  marqueurs.pari = query.pari;
  marqueurs.credit = query.credit;

  if (list_players && list_players.includes(`${query.pseudo}`)) {
    marqueurs.demarrer = afficher_bouton_demarrer(lobby, query.pseudo, query.password, query.pari, query.credit);
    marqueurs.liste = afficher_liste_lobby(lobby, query.pseudo, query.pari);

    page = fs.readFileSync("./modele_lobby.html", "utf-8");
  } else if (list_tables && list_tables.some(table => table.pseudos.some(player => player.name === query.pseudo))) {
    const table = list_tables.find(table => table.pseudos.some(player => player.name === query.pseudo));

    const table_index = list_tables.indexOf(table);
    marqueurs.table = table_index;
    page = fs.readFileSync("./modele_accueil_uno.html", "utf-8");
  } else {
    console.log("ERREUR : On n'a pas trouvé le jouer dans la liste!");
    throw new Error("Joueur introuvable");
  }

  page = page.supplant(marqueurs);

  // Envoi de la réponse.

  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(page);
  res.end();
};
module.exports = trait;

