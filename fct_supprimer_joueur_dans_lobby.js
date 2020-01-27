"use strict";
const _ = require("lodash");
const fs = require("fs");
function _supprimer_joueur_dans_lobby(pseudo,pari) {
    let contenu;
    let lobby;
    if(!pari){
        return;
    }
    contenu = fs.readFileSync("lobby.json", "utf-8");
    lobby = JSON.parse(contenu);
    let list_players = _.get(lobby, `${pari}`);
    if (list_players && list_players.includes(`${pseudo}`)) {
        list_players.splice(list_players.indexOf(pseudo), 1);
    }else {
        return;
    }
    contenu = JSON.stringify(lobby);
    fs.writeFileSync("lobby.json", contenu, "utf-8");
    return;
}
module.exports = _supprimer_joueur_dans_lobby;