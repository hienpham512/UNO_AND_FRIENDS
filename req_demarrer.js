"use strict";

const _ = require("lodash");
const fs = require("fs");
const _supprimer_joueur_rejouer_dans_listes_tables = require('./fct_supprimer_joueurs_terminer_match.js');
require("remedial");

const trait = function (req, res, query) {
  let page;
  let contenu;
  let lobby;
  let marqueurs;
  let contenu_tables;
  let tables;

  const current_player = query.pseudo;
  const pari = query.pari;
  let list_players_in_game = [];
  let table_index;

  contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
  tables = JSON.parse(contenu_tables);

  _supprimer_joueur_rejouer_dans_listes_tables(query.table, query.pari, query.pseudo);
  contenu = fs.readFileSync("lobby.json", "utf-8");
  lobby = JSON.parse(contenu);

  let list_players = _.get(lobby, `${pari}`);
  if (list_players && list_players.includes(`${current_player}`)) {
    let list_tables = _.get(tables, `${pari}`);

    const indexOfPlay = list_players.indexOf(current_player);
    list_players_in_game = list_players.slice(indexOfPlay, indexOfPlay + 7);

    const list_players_with_cards = list_players_in_game.map((player) => {
    	return {
    		name: player,
				cards: []
			};
		});
    const new_table = {
      pseudos: list_players_with_cards,
      remaining_cards: [],
      clockwise: true,
      next_player: current_player,
      additional_cards: 0
    };

    if (!list_tables) {
      list_tables = [];
    }

    list_tables.push(new_table);
    table_index = list_tables.indexOf(new_table);
    tables[`${pari}`] = list_tables;

    contenu_tables = JSON.stringify(tables);
    fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");

    list_players = list_players.filter(player => !list_players_in_game.includes(player));

    lobby[`${pari}`] = list_players;
    contenu = JSON.stringify(lobby);
    fs.writeFileSync("lobby.json", contenu, "utf-8");
  }


  marqueurs = {};
  marqueurs.pseudo = query.pseudo;
  marqueurs.password = query.password;
  marqueurs.credit = query.credit;
  marqueurs.pari = query.pari;
  marqueurs.table = table_index;

  page = fs.readFileSync("./modele_accueil_uno.html", "utf-8");
  page = page.supplant(marqueurs);


  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(page);
  res.end();
};

module.exports = trait;
