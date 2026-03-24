# visualDon2026-rociry - Sport et études
Ce repository contiendra le code et le développement de notre projet en visualDon, pour cette année 2026. Le groupe d'élèves est composé de Ryad Ait-Slimane, Cindy Demont et Romain Blanchard.

# Contexte des données
Nous avons décidé de nous intéresser aux corrélations entre sport et études. Compatibles, incompatibles ? Nous allons tenter d'y répondre en interrogeant nos pairs sur leur mode de vie. L'objectif est de comprendre comment certain·e·s arrivent avec succès à allier leur activité sportive, tout en suivant le rythme exigeant des cours. Mais il sera aussi important pour nous de mettre en lumière celles et ceux qui dans le cas contraire se retrouvent dans l'obligation de couper toute activité physique. Nous sommes directement touchés par ces thématiques, et nous voulons apporter aux étudiant·e·s une vision plus claire de la place du sport lors des études. Nous souhaitons qu'iels puissent voir où iels se situent par rapport aux autres personnes qui mènent également une vie académique. L'objectif est donc de rendre accessibles et de mettre en avant des chiffres pour voir où est-qu'il pourrait y avoir des améliorations possibles, notamment dans la conception des programmes étudiants, et des motivations diverses et variées de nos protagonistes.
## Nos sources de données
Afin de collecter des données et de mener une recherche pertinente, nous avons mis en place un *questionnaire (Google Forms)* qui va nous permettre de segmenter des informations et d'obtenir des données sur notre échantillon (les étudiant·e·s dans le Canton de Vaud, avec différentes options proposées). De cette manière, nous sommes certain·e·s que les données répondront à ce que nous voulons exactement traiter. Il existe également des *documents de recherche sur internet*, dont un qui porte sur une étude menée à l'Université de Neuchâtel en 2025 (https://www.unine.ch/wp-content/uploads/2025/12/LS_SPORTS_rapport-enquete-sport-suisse_2025.pdf). Les chercheurs ont enquêté auprès de plus de 15'000 étudiants en romandie sur la thématique du sport dans le but de comprendre les tendances et corrélations actuelles. Certains articles de presse traitent également de thématiques similaires (https://www.swissinfo.ch/fre/les-%C3%A9tudiants-sont-plus-sportifs-que-la-moyenne-suisse/46572028) et nous permettent d'avoir accès à des chiffres globaux.
## Les biais potentiels
Nous allons nous inspirer de leurs processus d'extraction de données. Toutefois, nous ne pouvons pas garantir l'objectivité exacte puisque ces données ne proviennent pas de nous, donc nous resterons vigilant·e·s et attentif·ve·s aux biais potentiels. Ces derniers pourraient être que nous mettons notre attention uniquement sur les étudiant·e·s qui sont probablement intéressé·e·s par le sport, et que cela nous empêche d'approfondir ce phénomène de manière généralisée pour l'ensemble des apprenants. Mais encore, nous ne pouvons pas intérroger l'ensemble des personnes qui réalisent actuellement un parcours académique, donc nous ne pouvons pas réellement représenter l'entier de la société estudantine. Nous ne pouvons pas non plus réellement vérifier le temps que les gens passent effectivement à faire du sport et en ce sens, notre étude sera forcément influencée par l'honnêteté des participants.
Enfin, un autre biais à ne pas négliger est celui des raisons extérieures aux cours. En effet, certaines personnes peuvent tout à fait se voir dans l'obligation d'arrêter la pratique de leur sport pour des facteurs conplétements extérieurs aux cours, et c'est donc compliqué à quantifier dans notre étude (bien que nous tentons de prendre acte de ceci dans notre formulaire, en demandant aux gens quelles sont les raisons de l'arrêt ou non de leur sport en cours d'études).

# Description des données
Puisque nous souhaitons explorer un échantillon plutôt large, nos données seront principalement quantitatives, représentant la masse et non le détail. Le format de ces dernières sera à la base l'ensemble des réponses collectées, puis le tout sera traité et catégorisé dans un fichier .csv, afin de mieux pouvoir interpréter ces résultats.

## Il y aura différents types de ressources, les voici en détail (les attributs sont amenés à évoluer) :
| Attribut | Type de données | Format |
|---|---|---|
| `id_reponse` | integer | Auto-increment |
| `genre` | string | Texte (identité de genre) |
| `niveau_etudes` | string | Texte (choix unique) |
| `lieu` | string | Texte (choix unique : canton) |
| `lieu_residence` | boolean | choix (rural ou citadin) |
| `lieu_influence` | boolean | choix (oui ou non) |
| `pratique_sport` | boolean | Boolean (pratique ou a pratiqué) |
| `type_sport` | string | Texte (choix unique : Individuel, Collectif) |
| `frequence_sport` | integer | Nombre entier (séances par semaine) |
| `heure_sport_hebdo` | float | Nombre |
| `arret_sport` | boolean | Boolean (arrêt dû aux cours) |
| `raisons_arret` | list | Liste de motifs possibles |
| `impact_perf_academique` | integer | Échelle de Likert (1–5) |
| `impact_perf_sportive` | integer | Échelle de Likert (1–5) |

# But de notre recherche
Comme brièvement abordé dans l'explication du sujet, notre but est de mettre en avant la façon dont le rythme des cours peut coexister (ou non) avec la pratique quotidienne d'un sport. Nous ne voulons pas imposer un point de vue, mais explorer de manière objective les corrélations entre charge de travail et rythme d'entraînements sportifs. Nous souhaitons davantage explorer ce que vont nous offrir les données, pour ensuite expliquer et mettre en avant les différentes tendances.
L'objectif est que chacun·e puisse se retrouver dans notre approche, et comprendre les raisons d'un arrêt complet, ou au contraire, de l'équilibre que l'on peut trouver pour être plus performant·e. Nous souhaitons offrir une plateforme qui permettraient aux étudiant·e·s de se rendre compte où ils se situent par rapport à leurs semblables.

# Réferences
Certaines universités et acteur·trice·s du monde éditorial ont abordé ce sujet, souvent dans le cadre de travaux académiques, afin d'établir des tendances et d'obtenir des résultats factuels. Toutefois, il existe peu  de recherche démontrée selon le prisme de l'infographie interactive. 
## Études et articles
- https://www.unine.ch/wp-content/uploads/2025/12/LS_SPORTS_rapport-enquete-sport-suisse_2025.pdf
- https://www.swissinfo.ch/fre/les-%C3%A9tudiants-sont-plus-sportifs-que-la-moyenne-suisse/46572028
- https://opendata.swiss/fr
- https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2023-02/rapport-igesr-21-22-352a-26349.pdf
## Exemples d'infographies
- https://pudding.cool/2024/03/teenagers/
- https://pointcommun.parisnanterre.fr/archives-des-articles/infographie-indispensable-n12-luniversite-paris-nanterre-une-universite-sportive
- https://www.behance.net/gallery/17787045/Interactive-infographic-Students-of-El-Pilar-School
- https://www.behance.net/gallery/2412324/Infographics-Raconteur-Dashboards
# Lien vers nos wireframes
https://www.figma.com/design/t9QaiwaMJ27NdUH361QyDi/Wireframes-VisualDon2026---Rociry?node-id=0-1&t=jfdyPKFjRC7XMl6x-1
