🌿 BIOCOL – Trouve des producteurs bio locaux facilement
BIOCOL est une application mobile développée en React Native avec TypeScript, visant à connecter les consommateurs avec les producteurs biologiques autour d’eux. Grâce à une carte interactive, une recherche intelligente, un système de favoris et une UX intuitive, l’utilisateur peut visualiser et localiser les producteurs certifiés bio à proximité.

🛠️ Stack Technique
Outil / Langage	Usage
React Native (TypeScript)	Développement mobile cross-platform
Leaflet via WebView	Affichage dynamique de la carte
REST API Agence Bio	Données publiques des producteurs bio
React Navigation	Navigation entre les vues
SQLite	Stockage local (pour extensions futures)
React Context	Gestion globale des favoris
Icons (Ionicons)	Interface graphique

✨ Fonctionnalités principales
📍 Localisation des producteurs
Affichage des producteurs bio sur une carte interactive.

Utilisation de la géolocalisation de l’utilisateur pour centrer la carte.

Les producteurs changent automatiquement selon la zone visible.

🔎 Recherche et filtrage
Recherche par nom ou ville dans la liste.

Tri dynamique des résultats selon plusieurs critères (distance, nom...).

Jauge de rayon personnalisable (ex : 5 à 100 km).

💚 Favoris
Ajout/suppression de favoris avec un simple clic sur un cœur.

Les producteurs favoris sont persistés localement (AsyncStorage).

Vue dédiée : écran “Favoris” pour tout retrouver rapidement.

Barre de recherche intégrée à la vue Favoris.

🗺️ Vue détaillée
Chaque producteur possède une fiche détaillée :

Activités

Adresse

Lieu de production

Certificats (organisme, date)

Un bouton "Voir carte" permet de localiser un producteur depuis la liste.

🧭 Navigation intuitive
Barre de navigation bas (TabBar) avec deux vues :

Recherche

Favoris

Navigation stackée vers la fiche de détail.

🔧 Installation & Lancement
1. Clone le dépôt
   
git clone https://github.com/ton-compte/biocol.git
cd biocol

3. Installe les dépendances

npm install

4. Lancer l’application

npx react-native run-android
⚠️ Assure-toi d’avoir un device ou un émulateur connecté (et le débogage USB activé)

📦 Structure du projet

biocol/
├── src/
│   ├── screens/              # Pages principales (Recherche, Favoris, Détail)
│   ├── components/           # Composants UI réutilisables
│   ├── navigation/           # Configuration de navigation
│   ├── services/             # API Agence Bio, DB locale (SQLite)
│   ├── context/              # Contexte global pour les favoris
│   ├── types/                # Types TypeScript centralisés
├── android/                  # Projet Android natif
├── assets/                  # Icônes, images
└── App.tsx                  # Point d’entrée principal
🔐 Permissions Android
L’application demande :

ACCESS_FINE_LOCATION : pour centrer la carte autour de l’utilisateur

Assure-toi d’avoir bien accepté l’autorisation sur ton téléphone.

📈 Fonctionnalités à venir
Connexion / compte utilisateur

Filtres supplémentaires (certifications, types d’activités)

Partage de producteur

Notifications (ex : marchés bio à venir)

Version iOS

👨‍💻 Auteur
Valentin PEREIRA
Brandon MENU
