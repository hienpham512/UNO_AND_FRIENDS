"use strict";
const fs= require('fs');

function _compter_pari(table,pari, credit, pseudo){
    let contenu_fichier;
    let listeMembres;

    contenu_fichier = fs.readFileSync("membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);
    credit = Number(credit);
    pari = Number(pari);
    if(pseudo === table.winner){
        credit += pari*(table.pseudos.length - 1);
    }else {
        credit -= pari;
    }
    console.log(credit);
    for(let i = 0; i < listeMembres.length; i++ ){
        if(listeMembres[i].pseudo === pseudo){
            listeMembres[i].credit = credit;
        }
    }
    contenu_fichier = JSON.stringify(listeMembres);

    fs.writeFileSync("membres.json", contenu_fichier, 'utf-8');
    return pari;
}
module.exports = _compter_pari;