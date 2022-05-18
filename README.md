# Création d'un réseau social d'entreprise Groupomania



## Préalables requis

Ce projet nécessite
-Node.js
-MySQL



## Cloner le projet

Le projet peut être cloné via le repository https://github.com/FrCbl/ocr-rsegroupomania.git



## Base de données MySQL

Par le biais d'une console MySQL,  créer une base de données nommée ***rsegroupomania***.
Importer, ensuite, le fichier nommé *myGroupomaniaBdd.sql* se trouvant dans le répertoire backend/script/sql



## Backend du projet	 ##

Modifier le fichier de variables d'environnement *.env* disponible à la racine du dossier *backend*

A savoir le PORT,  MY_BDD_HOST_P2 pour l'hôte, MY_BDD_NAME_P2 pour le nom de la base de données, MY_BDD_USER_P2 pour le nom d'utilisateur MySQL et MY_BDD_PASS_P2 pour le mot de passe du ledit compte MySQL utilisé.

Enfin,  renseignez MY_SECRET_TOKEN_KEY_P2 qui sera la clé privée secrète nécessaire à la signature du contenu du jeton (token).

Le serveur peut se lancer via la commande *nodemon server* en se plaçant dans le répertoire *backend*



## Frontend du projet ##

Le framework Vue a, ici, été utilisé. Le frontend utilise la version Vue CLI 5.0.4.

Ce dernier pourra être exécuté par la commande 'npm run serve'.
