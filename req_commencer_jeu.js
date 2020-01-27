"use strict";

const _ = require("lodash");
const fs = require("fs");
const afficher_cartes = require("./fct_afficher_cartes.js");
const deviser_cartes = require("./fct_deviser_cartes.js");
const afficher_cartes_en_jeu = require("./fct_afficher_cartes_en_jeu.js");
const generateColorButtons = require("./fct_afficher_bouton_couleur.js");
const _compter_pari = require('./fct_compter_pari.js');

function _afficher_detail_point(table) {
    let html = '';

    for (let i = 0; i < table.pseudos.length; i++){
        if(table.pseudos[i].name !== table.winner){
            html += `${table.pseudos[i].name} : `;
            for(let j = 0; j < table.pseudos[i].cards.length; j++){
                let card = table.pseudos[i].cards[j];
                html += `<img src="../UNO_card/${card.chiffe}_${card.couleur}.png" alt="${card.chiffe}_${card.couleur}" style="width:40px;height:70px;"/>`;
            }
        }
        html += '<br>';
    }

    return html;
}
function trait(req, res, query) {
    let marqueurs;
    let page;
    let cartes_complet;
    let contenu_tables;
    let tables;
    let liste_cartes_deviser;
    let i = 0;
    let j = 0;
    let t;
    let liste_cartes_restes;
    const table_index = Number(query.table);

    contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
    tables = JSON.parse(contenu_tables);

    //rechercher la table instant

    const list_tables_with_pari = _.get(tables, `${query.pari}`);

    if (!list_tables_with_pari) {
        throw new Error('Table not found error!');
    }

    if (Number.isNaN(table_index) || table_index < 0 || table_index >= list_tables_with_pari.length) {
        throw new Error('Table not found error!');
    }

    //table est mtn un objet
    const table = list_tables_with_pari[table_index];

    //player est mtn un objet
    const player = table.pseudos.find(player => player.name === query.pseudo);
    const player_index = table.pseudos.indexOf(player);


    //On dévise les cartes
    if (table.pseudos.indexOf(player) === 0 && _.isEmpty(player.cards) && !table.winner) {
        cartes_complet = afficher_cartes();
        liste_cartes_deviser = deviser_cartes(cartes_complet, table.pseudos.length);

        for (j = 0; j < liste_cartes_deviser.length - 1; j++) {
            liste_cartes_deviser[j] = liste_cartes_deviser[j].sort();
            table.pseudos[j].cards = liste_cartes_deviser[j];
        }

        liste_cartes_restes = liste_cartes_deviser[liste_cartes_deviser.length - 1];
        table.remaining_cards = liste_cartes_restes;


        contenu_tables = JSON.stringify(tables);
        fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");

    }

    marqueurs = {};
    marqueurs.pseudo = query.pseudo;
    marqueurs.password = query.password;
    marqueurs.credit = query.credit;
    marqueurs.table = query.table;
    marqueurs.error = query.error || '';
    marqueurs.colorButtons = '';

    if ( table.current_card && table.current_card.couleur === 'n' && table.next_player === query.pseudo) {
        marqueurs.colorButtons = generateColorButtons(
            {
                pari: query.pari,
                pseudo: query.pseudo,
                password: query.password,
                credit: query.credit,
                table_index: query.table
            }
        );
    }
    marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, query.pari, query.pseudo, query.password, query.credit);

    if(table.winner || table.pseudos.length === 1){
        if(table.pseudos.length === 1){
            table.winner = query.pseudo;
        }
        if(table.winner === query.pseudo){
            marqueurs.annonce = 'GAGNÉ';
        }else{
            marqueurs.annonce = 'PERDU';
        }
        marqueurs.winner = table.winner;
        marqueurs.detail = _afficher_detail_point(table);

        contenu_tables = JSON.stringify(tables);
        fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");

        marqueurs.pari = _compter_pari(table,query.pari, query.credit, query.pseudo);

        page = fs.readFileSync("modele_terminer_jeu.html","utf-8");
    }else {
        marqueurs.pari = query.pari;
        page = fs.readFileSync("modele_commencer_jeu.html", "utf-8");
    }

    page = page.supplant(marqueurs);

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(page);
    res.end();
}

module.exports = trait;
