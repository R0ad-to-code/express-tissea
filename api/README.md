express-tissea est un projet pour voir les arrets et transport en commun sur Toulouse. 
Un admin peut ajouter/ supprimer des arrets sur une ligne, modifier une ligne.
L'utilisateur peut voir les lignes et arrets par catégory.

Le Backend est fait en NodeJS.
L'api est géré par Express.
La base de donnée est en MongoDB.
Le Front-end est en React avec VueJS.

Pour lancer le projet, ouvrez 2 terminals, un pour le FrontEnd et un pour le BackEnd : 
terminal 1 :
- cd api
- node app/seed.js
- npm run server

terminal 2 :
- cd front-end
- node run dev
