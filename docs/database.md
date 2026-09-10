# Documentation de la base de données

L’application utilise une base de données relationnelle Supabase organisée autour de trois tables principales : `profiles`, `destinations` et `trips`.

Cette séparation permet de ne pas répéter inutilement les mêmes informations. La table `profiles` contient les informations propres aux utilisateurs, `destinations` contient le catalogue des destinations proposées par le site, et `trips` contient les séjours personnalisés créés et sauvegardés par les utilisateurs.

Les tables sont reliées grâce à des clés primaires (PK), qui identifient de manière unique une ligne, et des clés étrangères (FK), qui permettent de référencer une ligne située dans une autre table.


## 1. Table `profiles`

La table `profiles` contient les informations de profil associées aux utilisateurs authentifiés.

| Colonne | Type | Rôle |
|---|---|---|
| `user_id` | `uuid` | PK et FK vers `auth.users.id` |
| `firstname` | `text` | Prénom de l'utilisateur |
| `email` | `text` | Adresse e-mail |
| `created_at` | `timestamptz` | Date et heure de création |
| `updated_at` | `timestamptz` | Date et heure de dernière modification |

`user_id` est la clé primaire : chaque utilisateur possède donc un identifiant unique.

Il s'agit également d'une clé étrangère vers `auth.users.id`, ce qui relie le profil au compte créé avec Supabase Auth.

Par exemple :

user_id : 7abc...
firstname : David
email : david@...
created_at : 2026-09-10...

Les champs `created_at` et `updated_at` utilisent le type `timestamptz`, c'est-à-dire une date et heure avec fuseau horaire.

Leur valeur par défaut `now()` permet d'enregistrer automatiquement la date et l'heure correspondantes.


## 2. Table `destinations`

La table `destinations` constitue le catalogue des destinations disponibles dans l'application.

| Colonne | Type | Rôle |
|---|---|---|
| `destination_id` | `text` | PK, identifiant unique de la destination |
| `city` | `text` | Ville |
| `country` | `text` | Pays |
| `language` | `text` | Langue étudiée |
| `description` | `text` | Description de la destination |
| `image` | `text` | Référence ou URL de l'image |
| `weekly_course_price` | `int4` | Prix hebdomadaire de base du cours |
| `created_at` | `timestamptz` | Date de création |

Par exemple, Madrid peut exister une seule fois dans cette table :

destination_id : madrid
city : Madrid
country : Spain
language : Spanish
weekly_course_price : 200

L'intérêt d'une table séparée est que Madrid n'a pas besoin d'être recréée chaque fois qu'un utilisateur construit un séjour.

Plusieurs voyages peuvent référencer la même destination.


## 3. Table `trips`

La table `trips` contient les séjours personnalisés créés par les utilisateurs.

| Colonne | Type | Rôle |
|---|---|---|
| `trip_id` | `uuid` | PK, identifiant unique du voyage |
| `user_id` | `uuid` | FK vers `profiles.user_id` |
| `destination_id` | `text` | FK vers `destinations.destination_id` |
| `duration` | `int4` | Durée du séjour |
| `course_type` | `text` | Type de cours |
| `accommodation` | `text` | Type de logement |
| `activities` | `text[]` | Liste des activités sélectionnées |
| `total_price` | `numeric` | Prix total calculé |
| `created_at` | `timestamptz` | Date de création |

`trip_id` est généré automatiquement grâce à `gen_random_uuid()`.

Chaque séjour possède ainsi son propre identifiant, même lorsque le même utilisateur crée plusieurs séjours.

Les deux clés étrangères sont particulièrement importantes :

`trips.user_id` → `profiles.user_id`

`trips.destination_id` → `destinations.destination_id`

Par exemple, si David crée un séjour de trois semaines à Madrid :

trip_id : T001
user_id : U001 → David
destination_id : madrid → Madrid
duration : 3
course_type : Intensive
total_price : 1450

La table `trips` n'a donc pas besoin de recopier toutes les informations concernant David ou Madrid.

Elle utilise les identifiants pour créer des relations avec les autres tables.


## 4. Relations entre les tables

La structure peut être représentée ainsi :

auth.users
    |
    | id
    v
profiles
    |
    | user_id
    v
trips
    |
    | destination_id
    v
destinations

La relation entre `profiles` et `trips` est de type un-à-plusieurs : un utilisateur peut créer plusieurs voyages.

La relation entre `destinations` et `trips` est également de type un-à-plusieurs : une même destination peut être utilisée dans plusieurs voyages.

Par exemple, Madrid existe une seule fois dans `destinations`, mais David, Marie et d'autres utilisateurs peuvent chacun créer leurs propres voyages vers Madrid.


# Sécurité RLS

La Row Level Security (RLS) de Supabase permet de définir les droits d'accès ligne par ligne.

Elle complète l'authentification : être connecté ne signifie pas automatiquement avoir accès aux données des autres utilisateurs.

`auth.uid()` correspond à l'UUID de l'utilisateur actuellement authentifié avec Supabase Auth.

Par exemple, la condition :

`auth.uid() = user_id`

signifie que l'utilisateur connecté peut effectuer l'action uniquement si la ligne lui appartient.

Ainsi, si David possède `user_id = U001`, il peut accéder à un voyage dont le `user_id` est U001, mais pas à un voyage appartenant à un autre utilisateur.


## RLS de la table `profiles`

La RLS est activée sur la table `profiles`.

### SELECT

L'utilisateur peut lire uniquement son propre profil.

Condition :

`auth.uid() = user_id`

Cette règle permet notamment à l'application de récupérer le prénom de l'utilisateur sans lui donner accès aux profils des autres utilisateurs.


### INSERT

L'utilisateur peut créer uniquement son propre profil.

Condition :

`auth.uid() = user_id`

Cela empêche un utilisateur connecté de créer un profil associé à l'identifiant d'un autre utilisateur.


### UPDATE

L'utilisateur peut modifier uniquement son propre profil.

La condition vérifie que :

`auth.uid() = user_id`

avant et après la modification.

Cela permet notamment de modifier le prénom, l'e-mail ou la date `updated_at` sans pouvoir modifier le profil d'un autre utilisateur.


### DELETE

Aucune policy DELETE n'est définie pour `profiles`.

Un utilisateur ne peut donc pas supprimer son profil directement depuis l'application.


## RLS de la table `destinations`

La RLS est également activée sur `destinations`.

### SELECT

Les destinations sont accessibles en lecture à tout le monde.

Condition :

`true`

Le catalogue de destinations n'est pas considéré comme une donnée privée. L'application doit pouvoir afficher Madrid, Barcelone, Londres, etc.

### INSERT / UPDATE / DELETE

Ces opérations ne sont pas autorisées aux utilisateurs depuis l'application.

Un utilisateur peut donc consulter Madrid, mais il ne peut pas modifier son prix, changer son pays ou supprimer la destination.

Le catalogue reste contrôlé par l'administrateur de la base.


## RLS de la table `trips`

La table `trips` possède un CRUD complet, mais chaque utilisateur ne peut agir que sur ses propres voyages.


### SELECT

L'utilisateur peut lire uniquement ses propres trips.

Condition :

`auth.uid() = user_id`

Cette règle est utilisée notamment pour la page `My Trips`.


### INSERT

L'utilisateur peut créer un voyage uniquement avec son propre `user_id`.

Condition :

`auth.uid() = user_id`

Cela empêche un utilisateur de créer un voyage au nom de quelqu'un d'autre.


### UPDATE

L'utilisateur peut modifier uniquement ses propres voyages.

La condition :

`auth.uid() = user_id`

est vérifiée avant et après la modification.

Cette policy est utilisée lorsque l'utilisateur modifie un voyage depuis `My Trips`.


### DELETE

L'utilisateur peut supprimer uniquement ses propres voyages.

Condition :

`auth.uid() = user_id`

Cette policy permet d'utiliser la fonctionnalité Delete de `My Trips` tout en empêchant la suppression des voyages appartenant à d'autres utilisateurs.


## Synthèse des policies RLS

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Son propre profil | Son propre profil | Son propre profil | Non |
| `destinations` | Tout le monde | Non | Non | Non |
| `trips` | Ses propres trips | Ses propres trips | Ses propres trips | Ses propres trips |

En résumé, les données personnelles (`profiles` et `trips`) sont protégées grâce à `auth.uid()`, tandis que `destinations` constitue un catalogue public accessible en lecture.

Supabase Auth permet d'identifier l'utilisateur, les clés étrangères permettent de relier les différentes tables et les policies RLS déterminent quelles données chaque utilisateur est autorisé à lire ou modifier.