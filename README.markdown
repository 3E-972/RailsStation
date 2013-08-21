RAILSTATION
===========

> Bring your Passport for taking the Express on time !

Railstation is closely coupled with Express (Light routing for Node) and Passport (Intellligent authentification midleware for Express).

It aim to provide a large range of wide-level features for easy and intelligent routing.

Warning ! RailStation is *not* a connect middleware like Express and Passport but it uses them.You always need to put them in your middleware stack.

Take care to place Passport before Express.

FEATURES
========

- Intégration totale avec Express et Passport (right checking + dispatching)
- Support explicite des Endpoint API
- Checking des paramètres de requete (URL + GET + POST)
- Dispatching par paramètres
- Dispatching par type du fichier requêté
- URL nommées
- Découverte des URL dynamique paramétrées par les droits du client
- Helper aux checking de:
  * paramètres (types notamment)
  * ranges
  * Dates ?
  * Regex
- Handling correct des erreurs (30x, 40x, 50x)
- Interface de log

- Différence claire entre les comportements à l'init et les comportements dynamiques
  * appel de fonction d'init (asynchrones ? tant que done() est pas appellé, endpoint non ready)


Création de routes
------------------

- Création automatique des routes express
  * Prenez votre Passport pour embarquer dans l'Express ! ;-)
- L'appel à la fonction est un sucre sur express + qqes fonctions générées automatiquement
- Redirections logguées
- Capacité à gérer finement les erreurs
  * sortie HTML (via templates ?) (plusieurs fichiers possible, selon droits ou zones)
  * sortie JSON
  * log !!!
  * action custom ?
