//Ajouter d'une persoone dans la liste d'attente.
//req_rejondre

"use strict";
const _ = require("lodash");
const fs = require("fs");
require('remedial');

const afficher_liste_lobby = require("./fct_afficher_liste_lobby.js");
const afficher_bouton_demarrer = require("./fct_afficher_bouton_demarrer.js");

function trait(req, res, query) {
  let page;
  let contenu;
  let lobby;
  let marqueurs ={erreur : ""};

  //Récupération de la liste des gens déjà en atttente.

  contenu = fs.readFileSync("lobby.json", "utf-8");
  lobby = JSON.parse(contenu);

  //Recherche du pseudo à ajouter dans la liste.

  if(isNaN(Number(query.pari)) || query.pari === ''){
    marqueurs.erreur = "<p style='color: black'>Pari n'est pas valible</p>";
    page = fs.readFileSync('modele_afficher_formulaire_placer_pari.html',"utf-8");

  }else {
    const list_players = _.get(lobby, `${query.pari}`, []);
    if (!list_players.includes(query.pseudo)) {
      list_players.push(query.pseudo);
      lobby[`${query.pari}`] = list_players;
      contenu = JSON.stringify(lobby);
      fs.writeFileSync('lobby.json', contenu, 'utf-8');
    }
    page = fs.readFileSync("./modele_lobby.html", "utf-8");
  }

  marqueurs.pseudo = query.pseudo;
  marqueurs.password = query.password;
  marqueurs.pari = query.pari;
  marqueurs.credit = query.credit;
  marqueurs.demarrer = afficher_bouton_demarrer(lobby, query.pseudo, query.password, query.pari, query.credit);
  marqueurs.liste = afficher_liste_lobby(lobby, query.pseudo);



  page = page.supplant(marqueurs);

  //Envoie de la réponse.

  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(page);
  res.end();

};

module.exports = trait;

