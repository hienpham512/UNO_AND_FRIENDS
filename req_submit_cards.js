"use strict";

const _ = require("lodash");
const fs = require("fs");
const afficher_cartes_en_jeu = require("./fct_afficher_cartes_en_jeu.js");
const generateColorButtons = require("./fct_afficher_bouton_couleur.js");

require('remedial');

function _findNextPlayerIndex(table, player_index) {
    return table.clockwise ? (player_index + 1) % table.pseudos.length
        : (player_index - 1 + table.pseudos.length) % table.pseudos.length;
}

function _isChosenCardInvalid(current_card, chosen_card, additional_cards) {
    if (!current_card) {
        return false;
    }

    if (chosen_card.couleur === 'n') {
        return false;
    }

    if (current_card.chiffe === chosen_card.chiffe) {
        return false;
    }

    if (current_card.couleur === chosen_card.couleur && additional_cards === 0) {
        return false;
    }

    return true;
}

function _analyzeCards({pari, pseudo, password, credit, table_index, marqueurs, chiffe, couleur, chosenColor,action}) {
    let contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
    const tables = JSON.parse(contenu_tables);

    const list_tables_with_pari = _.get(tables, `${pari}`);

    if (!list_tables_with_pari) {
        throw new Error('Table not found error!');
    }

    if (Number.isNaN(table_index) || table_index < 0 || table_index >= list_tables_with_pari.length) {
        throw new Error('Table not found error!');
    }

    const table = list_tables_with_pari[table_index];
    const player = table.pseudos.find(player => player.name === pseudo);

    const player_index = table.pseudos.indexOf(player);
    const played_card = {chiffe, couleur};

    if (player.name !== table.next_player) {
        marqueurs.error = `<p style='color: white'>Ce n'est pas votre tour, c'est le tour à ${table.next_player}</p>`;
        marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
        return;
    }

    if (table.current_card && table.current_card.couleur === 'n' && played_card.chiffe !== 'undefined') {
        marqueurs.error = "<p style='color: white'>Choisissez-vous la couleur, svp!</p>";
        marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
        return;
    }
    if(action){
        player.cards.push(played_card);
        let next_index = _findNextPlayerIndex(table, player_index);
        table.next_player = table.pseudos[next_index].name;
        contenu_tables = JSON.stringify(tables);
        fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");

        marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
        return;
    }
    const chosen_card = chosenColor
        ? { chiffe: table.current_card.chiffe, couleur: chosenColor }
        : player.cards.find(card => _.isEqual(card, played_card));

    if (!chosen_card) {
        throw new Error(`Player ${player.name} does not have this cards: 
	    - chiffe: ${chiffe} 
	    - couleur: ${couleur}`);
    }

    if (_isChosenCardInvalid(table.current_card, chosen_card, table.additional_cards)) {
        marqueurs.error = "<p style='color: white'>Ce n'est pas une carte appropriée</p>";
        marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
        return;
    }


    if(chosen_card.couleur === 'n' && chosen_card.chiffe !== '+2'){
        console.log(player.cards.indexOf(chosen_card));
        player.cards.splice((player.cards.indexOf(chosen_card)),1);
    }else {
        player.cards = player.cards.filter(card => !_.isEqual(card, chosen_card));
    }
    if (chosen_card.couleur === 'n') {
        table.current_card = chosen_card;

        contenu_tables = JSON.stringify(tables);
        fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");

        marqueurs.colorButtons = generateColorButtons({pari, pseudo, password, credit, table_index});
        marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
        return;
    }
    if (chosen_card.chiffe === 'I') {
        table.clockwise = !table.clockwise;
    }

    let next_index = _findNextPlayerIndex(table, player_index);

    table.next_player = table.pseudos[next_index].name;

    if (chosen_card.chiffe === 'skip') {
        next_index = _findNextPlayerIndex(table, next_index);

        table.next_player = table.pseudos[next_index].name;
    }

    if (chosen_card.chiffe.includes('+')) {
        table.additional_cards += Number(chosen_card.chiffe.substring(1));

        if (
            (chosen_card.chiffe === '+4' && table.pseudos[next_index].cards.every(card => card.chiffe !== '+4'))
            || (table.pseudos[next_index].cards.every(card => !card.chiffe.includes('+')))
        ) {
            while (table.additional_cards > 0) {
                const random = Math.floor(Math.random()*table.remaining_cards.length);
                table.pseudos[next_index].cards.push(table.remaining_cards[random]);
                table.remaining_cards.splice(random,1);
                table.additional_cards -= 1;
            }

            next_index = _findNextPlayerIndex(table, next_index);

            table.next_player = table.pseudos[next_index].name;
        }
    }
    if(player.cards.length === 0){
        table.winner = pseudo;
    }

    table.current_card = chosen_card;

    contenu_tables = JSON.stringify(tables);
    fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");
    marqueurs.cartes = afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit);
}

function trait(req, res, query) {
    const table_index = Number(query.table);

    const marqueurs = {error: '', colorButtons: '', take_card : ''};

    _analyzeCards({
        pari: query.pari,
        pseudo: query.pseudo,
        password: query.password,
        credit: query.credit,
        table_index,
        chiffe: decodeURIComponent(query.chiffe),
        couleur: query.couleur,
        chosenColor: query.chosenColor,
        marqueurs,
        action : query.action
    });

    marqueurs.pseudo = query.pseudo;
    marqueurs.password = query.password;
    marqueurs.credit = query.credit;
    marqueurs.pari = query.pari;
    marqueurs.table = query.table;

    let page = fs.readFileSync("modele_commencer_jeu.html", "utf-8");
    page = page.supplant(marqueurs);


    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(page);
    res.end();
}

module.exports = trait;
