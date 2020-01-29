"use strict";
const _ = require("lodash");
const fs = require("fs");
function _findNextPlayerIndex(table, player_index) {
    return table.clockwise ? (player_index + 1) % table.pseudos.length
        : (player_index - 1 + table.pseudos.length) % table.pseudos.length;
}
function _supprimer_joueur_rejouer_dans_listes_tables(table_index, pari,pseudo){
    if(!table_index || !pari){
        return;
    }
    let contenu_tables = fs.readFileSync("tables_en_jeu.json", "utf-8");
    const tables = JSON.parse(contenu_tables);

    const list_tables_with_pari = _.get(tables, `${pari}`);

    if (!list_tables_with_pari) {
        throw new Error('Table not found error!');
        return;
    }

    if (Number.isNaN(table_index) || table_index < 0 || table_index >= list_tables_with_pari.length) {
        throw new Error('Table not found error!');
        return;
    }

    const table = list_tables_with_pari[table_index];
    const player = table.pseudos.find(player => player.name === pseudo);
    if (!player) {
        return;
    } else {
        table.pseudos.splice(table.pseudos.indexOf(player), 1);
        if(table.next_player === pseudo && !table.winner){
            let next_index = _findNextPlayerIndex(table, table.pseudos.indexOf(player));

            table.next_player = table.pseudos[next_index].name;
        }
    }
    contenu_tables = JSON.stringify(tables);
    fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");
}
module.exports = _supprimer_joueur_rejouer_dans_listes_tables;
