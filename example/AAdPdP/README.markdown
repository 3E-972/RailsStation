Site de l'Association Amicale des Plombiers de Paris
====================================================

Ce site est un site example de démonstration de Railstation.

Il est construit autour d'un exemple fictif: les Plombiers de Paris souhaitent
un site web pour leur association amicale.

Ce site web a une face publique, une face pour les clients, une face pour les
plombiers eux-meme, et enfin une pour le ou les administrateurs.

La face publique présente la procédure d'inscription.
La face cliente présente les plombiers proches du client et une liste publique.
La face plombier présente tous les plombiers de Paris, afin notamment
d'organiser l'apero.
La face admin... je ne sais pas encore. ;-)

Le site est une SPA (Single Page Application) tournant avec AngularJS,
interrogeant le serveur via une API simple pour le client, et légèrement
complexe pour le serveur à cause d'une gestion des droits et de vérification des
types (notamment l'endpoint /plumbers/query).

Ce site fictif (et probablement incomplet au moment de la lecture de ce README)
présente comment Railstation aide à gérer une API complexe pour un site de
taille raisonnable utilisant NodeJS, Express, et Passport.
