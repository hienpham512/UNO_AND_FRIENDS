"use strict"

const fs = require("fs");
require ("remedial");

function trait (req,res,query){
    let page;
    let contenu_ficher;
    let listeMembres;
    let marqueurs;
    let pseudo;
    let password;

    //ON LIT LES COMPTES EXISTANTS

    contenu_ficher = fs.readFileSync("membres.json",'utf-8');
    listeMembres = JSON.parse(contenu_ficher);
    //AFFICHER DE LA modele_regle_president
    page = fs.readFileSync("modele_accueil_president.html","utf-8");
    let i = 0;
    marqueurs = {}
    marqueurs.pseudo = query.pseudo;
    marqueurs.password = query.password;
	page = page.supplant(marqueurs);

    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(page);
    res.end();
}
module.exports = trait;

