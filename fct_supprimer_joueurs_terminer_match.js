"use strict";
const _ = require("lodash");
const fs = require("fs");

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
    }
    contenu_tables = JSON.stringify(tables);
    fs.writeFileSync("tables_en_jeu.json", contenu_tables, "utf-8");
}
module.exports = _supprimer_joueur_rejouer_dans_listes_tables;
