"use strict";
const fs = require("fs");

function display_card(pseudo, password, credit, pari, table, chiffe, couleur) {
    const path = `/req_submit_cards?pseudo=${pseudo}&pari=${pari}&password=${password}&credit=${credit}&table=${table}&chiffe=${encodeURIComponent(chiffe)}&couleur=${couleur}`;
    let html = `<a href="${path}" class="buttonCard">`;
    html += `<img src="../UNO_card/${chiffe}_${couleur}.png" alt="${chiffe}_${couleur}" style="width:50px;height:90px;"/>`;
    html += '</a>';
    return html;
}

function _take_card(table, cards, pseudo, pari, password, credit, table_index) {
    let html = '';
    const take = table.remaining_cards[Math.floor(Math.random() * table.remaining_cards.length)];
    table.remaining_cards.splice(table.remaining_cards.indexOf(take), 1);
    const path = `/req_submit_cards?pseudo=${pseudo}&pari=${pari}&password=${password}&credit=${credit}&table=${table_index}&chiffe=${encodeURIComponent(take.chiffe)}&couleur=${take.couleur}&action=takeCard`;
    html += `<div class="take_card">`;
    html += `<a href="${path}" class="buttonTakecard">`;
    html += `<img src="../boder/uno1.png" class="takeCard"style="height: 95px;width: 120px"/>`;
    html += '</a>';
    html += '</div>';
    html += `<h3>Piocher une carte</h3>`;
    return html;
}

function afficher_cartes_en_jeu(table, table_index, pari, pseudo, password, credit) {
    let html = "";
    let nombres_cartes;
    let autre_joueur_cartes;
    let i;


    const player = table.pseudos.find(player => player.name === pseudo);
    const cards = player.cards;
    html = '';
    let bloque = 0;
    for (const other_player of table.pseudos) {
        if (other_player.name !== player.name) {
            autre_joueur_cartes = other_player.cards;
            html += `<div class="bloque${bloque}">`;
            bloque++;
            autre_joueur_cartes.forEach(() => {
                html += `<img src="../UNO_card/back.png" alt="back" style="width:50px;height:90px;"/>`;
            });
            html += '<br>';
            html += `<h2>${other_player.name}</h2>`;
            html += '<br>';
            html += '</div>';
        }
    }
    html += '<br>';
    if (table.current_card) {
        html += '<br>';
        html += `<img class="cardObjet" src="../UNO_card/${table.current_card.chiffe}_${table.current_card.couleur}.png" alt="${table.current_card.chiffe}_${table.current_card.couleur}" style="width:90px;height:150px;"/>`;
        if(table.clockwise){
            html += `<img  class="clock" src="../clockwise/muiten1${table.clockwise}.png" alt="../clockwise/muiten${table.clockwise}.jpg" style="width:250px;height:250px;"/>`;
        }else {
            html += `<img class="clock" src="../clockwise/muiten1${table.clockwise}.png" alt="../clockwise/muiten${table.clockwise}.jpg" style="width:250px;height:250px;"/>`;
        }
        html += '<br>';
    }
    html += '<div class="playerCard">';
    html +=`<h1>C'est le tour à ${table.next_player}!</h1>`;
    for (i = 0; i < cards.length; i++) {
        html += display_card(pseudo, password, credit, pari, table_index, cards[i].chiffe, cards[i].couleur);
    }
    html += `<h2>${pseudo}</h2>`;
    html += '</div>';
    if (table.current_card && table.next_player === pseudo) {
        html += '<br>';
        html += _take_card(table, player.cards, pseudo, pari, password, credit, table_index);
    }
    return html;

};
module.exports = afficher_cartes_en_jeu;
