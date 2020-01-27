//=========================================================================
// Site WEB demo PI
// Auteurs : P. Thiré & T. Kerbrat
// Version : 09/11/2018
//=========================================================================

"use strict";

const http = require("http");
const url = require("url");
let mon_serveur;
let port;

//-------------------------------------------------------------------------
// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION
//-------------------------------------------------------------------------

const req_commencer = require("./req_commencer.js");
const req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
const req_inscrire = require("./req_inscrire.js");
const req_identifier = require("./req_identifier.js");

const req_static = require("./req_statique.js");
const req_erreur = require("./req_erreur.js");
const req_regle_uno = require("./req_regle_uno.js");
const req_accueil_president = require("./req_modele_accueil_president.js");
const req_regle_president = require("./req_regle_president.js");
const req_demarrer = require("./req_demarrer.js");
const req_afficher_formulaire_placer_pari = require("./req_afficher_formulaire_placer_pari.js");
const req_rejoindre = require('./req_rejoindre.js');
const req_actualiser = require("./req_actualiser.js");

const req_commencer_jeu = require("./req_commencer_jeu.js");
const req_submit_cards = require("./req_submit_cards");
//-------------------------------------------------------------------------
// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE
//-------------------------------------------------------------------------


function traite_requete (req,res){

	let requete;
	let pathname;
	let query;

	console.log("URL reçue : " + req.url);
	requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

	// ROUTEUR

	try {
		switch (pathname) {
			case '/':
			case '/req_commencer':
				req_commencer(req, res, query);
				break;
			case '/req_afficher_formulaire_inscription':
				req_afficher_formulaire_inscription(req, res, query);
				break;
			case '/req_inscrire':
				req_inscrire(req, res, query);
				break;
			case '/req_identifier':
				req_identifier(req, res, query);
				break;
			case '/req_regle_uno':
				req_regle_uno(req,res,query);
				break;
			case '/req_accueil_president':
				req_accueil_president(req,res,query);
				break;
			case '/req_regle_president':
				req_regle_president(req,res,query);
				break;
			case '/req_afficher_formulaire_placer_pari':
				req_afficher_formulaire_placer_pari(req,res,query);
				break;
			case '/req_demarrer':
				req_demarrer(req,res,query);
				break;
			case '/req_rejoindre':
				req_rejoindre(req,res,query);
				break;
			case '/req_actualiser':
				req_actualiser(req,res,query);
				break;
			case '/req_commencer_jeu':
				req_commencer_jeu(req,res,query);
				break;
			case '/req_submit_cards':
				req_submit_cards(req,res,query);
				break;
			default:
				req_static(req, res, query);
				break;
		}
	} catch (e) {
		console.log('Erreur : ' + e.stack);
		console.log('Erreur : ' + e.message);
		//console.trace();
		req_erreur(req, res, query);
	}
};

//-------------------------------------------------------------------------
// CREATION ET LANCEMENT DU SERVEUR
//-------------------------------------------------------------------------

mon_serveur = http.createServer(traite_requete);
port = 5000;
//port = process.argv[2];
console.log("Serveur en ecoute sur port " + port);
mon_serveur.listen(port);
