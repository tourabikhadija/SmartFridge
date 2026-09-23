# ROCT — Smart Fridge

**ROCT** is a smart fridge management application that helps you track your products, their quantities, expiration dates, and avoid food waste. Built as a full-stack project with a React frontend and an Express/MongoDB backend.

---

## 🎯 Objectif du projet

Permettre à l'utilisateur de :

- suivre les produits stockés dans son réfrigérateur (quantités, prix, unités) ;
- être alerté avant l'expiration des produits et identifier les produits expirés ;
- réduire le gaspillage alimentaire grâce à des statistiques mensuelles (consommation et pertes) ;
- ajouter facilement des produits, manuellement ou par scan de code-barres.

---

## ✨ Fonctionnalités principales

| Module | Description |
| --- | --- |
| **Authentification** | inscription, connexion, déconnexion, profil (nom / email / mot de passe), token JWT |
| **Produits** | création, liste, détail, modification, suppression, consommation d'un produit, recherche et filtre par catégorie |
| **Scan de code-barres** | lecture via la caméra (`html5-qrcode`), enrichissement automatique via l'API Open Food Facts |
| **Catégories** | catégories prédéfinies (Légumes, Fruits, Produits laitiers, Viandes, Boissons, Conserves, Produits surgelés, Autre) ; gestion par un administrateur |
| **Notifications** | alertes d'expiration (valide / à bientôt expirer / expiré), filtrage par date, marquer comme lu |
| **Statistiques** | consommation mensuelle et pertes mensuelles (valeur en DH) |
| **Administration** | statistiques globales, activation / désactivation des utilisateurs, gestion des catégories |

---

## 🛠️ Technologies utilisées

### Frontend
- **React 19** + **TypeScript**
- **Vite 8** (build / dev server)
- **react-router-dom 7** (routing)
- **html5-qrcode** (lecture de code-barres)
- **oxlint** (linting)

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose 9**
- **jsonwebtoken** (JWT) + **bcryptjs** (hash des mots de passe)
- **zod** (validation)
- **node-cron** (tâches planifiées d'expiration)
- **dotenv** (configuration)

---

## 📁 Structure frontend / backend

```
SmartFridge/
├── backend/                  # API Express
│   ├── config/               # connexion MongoDB (db.js)
│   ├── controllers/          # logique métier (auth, product, category, …)
│   ├── jobs/                 # tâches cron (vérification des expirations)
│   ├── middleware/           # auth, admin, validation
│   ├── models/               # schémas Mongoose (User, Product, …)
│   ├── routes/               # définitions des routes API
│   ├── services/             # Open Food Facts, etc.
│   ├── validation/           # schémas zod
│   ├── .env                  # configuration (non versionné)
│   └── server.js             # point d'entrée (port 3001)
│
└── frontend/                 # application React
    ├── src/
    │   ├── components/       # Layout, Sidebar, UserBadge
    │   ├── pages/            # Dashboard, Products, ProductDetails, Notifications, Profile, Login, Register
    │   ├── services/         # appels API (auth, product, category, …)
    │   ├── styles/           # feuilles de style par page
    │   ├── utils/            # utilitaires frontend (icônes de catégories)
    │   ├── App.tsx           # routes
    │   └── main.tsx          # point d'entrée React
    └── vite.config.ts
```

---

## 🚀 Installation et lancement

**Prérequis :**
- Node.js 18+ (testé avec Node 24)
- MongoDB local (port par défaut 27017)

### 1. Backend

```bash
cd backend
npm install
# créer le fichier .env (voir section Configuration ci-dessous)
npm run start   # ou : node server.js
```

Le backend démarre sur `http://localhost:3001`.

> Le script de démarrage peut être ajouté dans `backend/package.json` si besoin (`"start": "node server.js"`).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173` (par défaut Vite) et appelle l'API sur `http://localhost:3001/api`.

---

## ⚙️ Configuration `.env`

Créez un fichier `backend/.env` avec les variables suivantes :

```env
# URI de connexion MongoDB
MONGO_URI=mongodb://localhost:27017/SmartFridge

# Clé secrète pour les tokens JWT (à remplacer)
JWT_SECRET=smartfridge_secret_key_123
```

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `MONGO_URI` | Oui | Chaîne de connexion MongoDB |
| `JWT_SECRET` | Oui | Clé secrète utilisée pour signer/vérifier les tokens JWT (durée : 1 jour) |

> Le port du backend est défini dans `server.js` (`PORT = 3001`). Le fichier `.env` n'est pas versionné.

---

## 📷 Utilisation du barcode scanner

1. Connectez-vous puis ouvrez la page **Products** (`/products`).
2. Cliquez sur **« Scanner un produit »**.
3. Autorisez l'accès à la caméra dans le navigateur.
4. Placez le code-barres du produit devant l'objectif.
5. Le backend interroge l'API publique **Open Food Facts**, le produit est pré-rempli (nom, quantité/unité, catégorie automatique), puis vous validez le formulaire.

Si le scan ne convient pas, le formulaire reste éditable : vous pouvez aussi saisir le produit **manuellement**.

---

## 🧪 Tests et build

### Frontend
```bash
cd frontend
npm run build     # vérification TypeScript + build de production
npm run lint      # oxlint
npm run preview   # prévisualisation du build
```

### Backend
```bash
cd backend
npm test          # node --test
```
Le rapport **`ROCT-Backend-Test-Report.pdf`** (racine du projet) documente les 46 vérifications API effectuées (inscription, connexion, produits, catégories, notifications, rôles, etc.), toutes passées.

---

## 📱 Responsive design

L'application est responsive sur **tablette (768px)** et **mobile (480px)** :

- la sidebar devient une **barre du haut pleine largeur** sur mobile ;
- les grilles (statistiques, produits, insights, alertes) passent à **une seule colonne** ;
- les cartes, formulaires et boutons s'adaptent en pleine largeur ;
- les titres, paddings et icônes sont compactés pour rester lisibles ;
- « `overflow-x: hidden` » évite tout défilement horizontal.

---

## 👀 Aperçu / screenshots

Aucun screenshot n'est inclus pour le moment. Des documents de référence sont disponibles à la racine du projet :

- `Architecture.pdf`
- `User-Stories.pdf`
- `ROCT-Backend-Test-Report.pdf`

---

## 📄 Licence

Projet réalisé dans le cadre d'un travail académique / personnel.