# CNAM Progress Tracker

Suivez et gérez votre progression dans vos UEs du CNAM de façon moderne, simple et personnalisée.

---

## 🚀 Fonctionnalités principales

- **Tableau d'avancement**
  - Visualisez toutes les UEs du CNAM
  - Filtrez par statut : À faire, En cours, Terminées
  - Recherche instantanée par code ou nom d'UE
  - Statut personnalisable pour chaque UE :
    - Not Selected (non suivie)
    - To Do (à faire)
    - In Progress (en cours)
    - Completed (terminée)
  - Ajoutez une note et un commentaire pour chaque UE terminée
  - Ajoutez des notes de progression pour les UEs en cours

- **Progression visuelle**
  - Cercle de progression animé avec pourcentage
  - Statistiques : nombre d'UEs terminées, en cours, à faire, total

- **Statistiques des notes**
  - Moyenne, médiane, meilleure et pire note
  - Nombre total de notes
  - Répartition graphique des notes par tranche

- **Gestion des données**
  - **Export** : sauvegardez toutes vos données dans un fichier JSON
  - **Import** : restaurez vos données depuis un fichier JSON
  - **Réinitialisation** : supprimez toutes vos données locales
  - Toutes les données sont stockées localement dans votre navigateur (confidentialité totale)

- **Filtres avancés**
  - Filtre rapide par type d'UE (À faire, En cours, Terminées) via boutons
  - Filtre par statut global (select)
  - Affichage uniquement des UEs sélectionnées (checkbox)

- **Interface moderne et responsive**
  - Design épuré, couleurs douces, header rouge CNAM
  - Icônes pour chaque statut et chaque onglet
  - Adapté mobile/tablette/desktop

---

## 📦 Installation & Lancement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/lionrayonnant/BetterCnam.git
   cd BetterCnam-webapp
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Lancer en mode développement**
   ```bash
   npm start
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

4. **Build production**
   ```bash
   npm run build
   ```

---

## 🖥️ Utilisation

- **Changer le statut d'une UE** : utilisez le menu déroulant sur chaque carte UE
- **Ajouter une note/commentaire** : disponible uniquement pour les UEs « Completed »
- **Filtrer** : utilisez la barre de recherche, le select ou les boutons de filtre
- **Exporter/Importer** : allez dans l'onglet « Gestion des données »
- **Réinitialiser** : bouton rouge dans l'onglet « Gestion des données »

---

## 🎨 Technologies utilisées
- React + TypeScript
- CSS moderne (responsive, flex, grid)
- Stockage local (localStorage)

---

## 📱 Responsive
L'application est utilisable sur ordinateur, tablette et mobile.

---

## 🛡️ Confidentialité
Toutes vos données restent **locales** sur votre navigateur. Rien n'est envoyé sur un serveur.

---

## 📝 Auteur
- [lionrayonnant](https://github.com/lionrayonnant)

---

## 💡 Améliorations possibles
- Synchronisation cloud (optionnel)
- Ajout de parcours personnalisés
- Export PDF
- Notifications de progression

---

**Pour toute suggestion ou bug, ouvrez une issue sur le dépôt GitHub !**
