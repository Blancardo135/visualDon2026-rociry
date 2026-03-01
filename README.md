# visualDon2026-rociry
Ce repository contiendra le code et le développement de notre projet en visualDon, pour cette année 2026. Le groupe d'élèves est composé de Cindy Demont, Ryad Ait-Slimane et Romain Blanchard.

# Notre sujet de recherche
Nous avons décidé de nous intéresser aux corrélations entre sport et études. Compatibles, incompatibles ? Nous allons tenter d'y répondre en interrogeant nos pairs sur leur mode de vie. L'objectif est de comprendre comment certain·e·s arrivent avec succès à allier leur activité sportive, tout en suivant le rythme exigent des cours. Mais il sera aussi important pour nous de mettre en lumière celles et ceux qui dans le cas contraire se retrouvent dans l'obligation de couper toute activité physique.

# Contexte des données
Afin de collecter des données, nous avons mis en place un *questionnaire (Google Forms)* qui va nous permettre de segmenter des informations et d'obtenir des données sur notre échantillon (les étudiant·e·s dans le Canton de Vaud, avec différentes options proposées). De cette manière, nous sommes certain·e·s que les données répondront à ce que nous voulons exactement traiter. Il existe également des *documents de recherche sur internet*, et nous allons nous inspirer de leurs processus d'extraction de données. Toutefois, nous savons que ces données ne correspondent pas forcément aux réalités actuelles ni à notre public cible, donc nous resterons vigilant·e·s et attentif·ve·s aux biais potentiels.

# Description des données
Puisque nous souhaitons explorer un échantillon plutôt large, nos données seront principalement quantitatives, représentant la masse et non le détail. Le format de ces dernières sera à la base l'ensemble des réponses collectées, puis le tout sera traité et catégorisé dans un fichier .csv, afin de mieux pouvoir interpréter ces résultats.
## Il y aura différents types de ressources, les voici en détail (les attributs sont amenés à évoluer) :
| Attribut | Type de données | Format |
|---|---|---|
| `id_reponse` | integer | Auto-increment |
| `genre` | string | Texte (identité de genre) |
| `niveau_etudes` | string | Texte (choix unique) |
| `pratique_sport` | boolean | Boolean (pratique ou a pratiqué) |
| `arret_sport` | boolean | Boolean (arrêt dû aux cours) |
| `raisons_arret` | list | Liste de motifs possibles |
| `heure_sport_hebdo` | float | Nombre |

# But de notre recherche
Comme brièvement expliqué dans l'explication du sujet, notre but est de mettre en avant l'impact des cours sur la pratique quotidienne du sport. Nous ne voulons pas imposer un point de vue, mais explorer de manière objective les corrélations entre charge de travail et rythme d'entraînements sportifs. L'objectif est que chacun·e puisse se retrouver dans notre approche, et comprendre les raisons d'un arrêt complet, ou au contraire, de l'équilibre que l'on peut trouver pour être plus performant·e.

