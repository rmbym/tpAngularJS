# tpAngularJS
L'application permet de faire se connecter, __Créer__ un compte utilisateur, __Ajouter__ ou __Supprimer__ une opération de mission, et d'__Update__ les opérations d'une mission.
## Structure du projet 
Le projet est divisé en 3 dossiers:
### angularFront 
Contient l'application Front end créée avec AngularJS.
### ExpressApi (sera Containeurisé)
Contient l'api qui interroge la bdd(Mongo). Créée avec NodeJs et Express.
### mongo (sera Containeurisé)
Contient la base de données (MongoDB) avec 2 utilisateurs créés : 
    * y@corp.com
    * jd@corp.com

Le dossier mongo-volume contient la base de donnée tpDatabase que j'ai créé pour ce tp.
## Lancer le projet
1. Se placer dans le répertoire App, à l'endroit où se trouve le fichier docker-compose.yml.
2. Pour lancer la création des containeurs de la base de mongodb et son Api, on lance la commande :``` docker-compose up```
3. Pour verifier que l'Api est bien lancée, on peut accéder à:
    * [La racine](http://localhost:3000/) qui devrait renvoyer "hello world".
    * [La liste des utilisateurs pré créée](http://localhost:3000/list) pour voir tous les mots de passe et user names associés.

4. Lancer l'application frontEnd en se déplacant dans le répertoire angularFront, puis en tapant:
```npm start```.
5. L'application est disponible à l'url [localhost:4200/](http://localhost:4200/).
6. ``` docker-compose down -v``` permet d'arreter les containeurs de l'APi et de la bdd.

⚠️⚠️⚠️ Il est possible de créer n'importe quel compte utilisateur, mais celui ci n'aura pas de mission, et donc pas de contenu.
Je n'ai pas eu le temps de créer une interface pour les missions, j'ai donc pré créé une mission pour un utilisateur qui n'existe pas encore.
Cet utilisateur doit impérativement avoir le compte mail suivant: grey@corp.com .

Cependant, il est tout de même possible d'initaliser une mission sans opération en executant une requete POST vers l'url: [http://localhost:3000/createMission](http://localhost:3000/createMission), avec le json suivant dans le corps de la requête: 
```
{
    "name": "Nom de la mission",
    "employeesMail": ["emailParticipant1","emailParticipant2"],
    "budget": Buget initial de la mission (ex: 200) pour 200€,
    "operations": [] // liste d'opérations de Crédit ou frais de la mission.
}
```
## Diagramme de classes

## Schema de la base de données 
