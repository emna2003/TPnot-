# TPnot-

Tout d'abord j'ai commencé par creer mes 3 fichiers js nécessaires pour le fonctionnement de mon application.
Le fichier index, routes et models.js.
Au niveau du fichier index, j'ai décalré le port de connexion, j'ai fait la connexion avec ma base de données et j'ai importé tous les modules nécessaires pour le fonctionnement de mon application. 
J'ai fait appel aussi à mon env qui contient le numéro du port, le lien de connexio à la base et mes clés secrétes JWT que je vais utiliser pour les tokens.

Au niveau du fichier models qui a évolué au fur et à mesure de mon développement, j'ai défini mes modéles de collection que je crée au niveau de la base de donnée, pour la phase de connexion ou des recherches par exemple.

Au niveau de mon fichier Routes se trouve toutes mes API et mes fonctions:

- La fonction "register": C'est la premiere fonction que j'ai crée et qui permet ,a partir d'une requete crée au niveau du body de POSTMAN contenant des données sous format json , de creer un utilisateur avec un nom, un email et un mot de passe au niveau de ma base de donnée. Cette fonction commence tout d'abord par vérifier si l'email est déja existant, si ce n'est pas le cas un "compte" est crée à partir des 3 données fournis. Pour travailler en sécurité, on fait appel au module bcrypt pour hasher le mot de passe. Au moment de la création du prmeier compte USER, un token est renvoyé comme réponse, qu'on pourra stocker. Pour génerer un token, j'ai fais appel au module JWT. 
La fonction register se sert du model crée au niveau du fichier models contenant le type des données ainsi que quelques contraintes, pour les envoyer au final à la base de données.

-La fonction "login": La fonction login permet à l'utilisateur de se connecter après avoir crée son compte et elle renvoie 2 tokens; un access et un refresh token. Pour commencer, j'ai fait 2 tests pour vérifier si pour l'utilisateur déja existant l'email ou le mot de passe insérés sont valides ou pas en les comparant avec ceux qui existent déja. Suite à cette vérification, je fais appel à mes 2 fonctions qui permettent de génerer mes 2 tokens et qui sont stockés dans un un autre fichier nommé "tokenUtilis". J'enregister mes données puis je renvoie mes 2 tokens à la fin comme réponse à la requete envoyé au niveau du body de postman contennt l'email et le mot de passe.


-La fonction "search": Cette fonction me permet à la fois de trouver la latitude et la longitude d'un bien à partir de quelques critéres de recherches mais aussi elle me permet de les enregister au fur et à mesure dans ma BDD.
Cette fonction contient 3 parties; la première partie sert à faire une recherche au niveau de la base de données à partir du DPE, GES et code postal pour trouver un /des biens correspondants stockés dans la variable "properties". AU niveau de la 2 éme partie partie, le but est de retrouver la latitude et la longitude de chaque bien à partir de son adresse. C'est pour ça que je crée adresse qui contient chaque code postal et BAN par exemple de chaque property,  que je fournis à ma fonction generatecoordinates qui utilise nominatim et qui me permet de trouver la géolocalisation.
Finalement à travers la derniere partie, j'envoie toutes mes recherches à ma base de données avec l'adresse, la latitude, la longitude, le ges, le dpe pour les enregistrer.




