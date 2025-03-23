# API CRUD avec Node.js et PostgreSQL

Une API simple permettant de gérer des produits avec les opérations CRUD (Create, Read, Update, Delete).

## Configuration

1. Cloner le repository
2. Installer les dépendances:
   ```
   npm install
   ```
3. Créer un fichier `.env` à la racine du projet avec les informations suivantes:
   ```
   DB_HOST=db.gidijhzhaqnhbllztskb.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe
   DATABASE_URL=postgresql://postgres:votre_mot_de_passe@db.gidijhzhaqnhbllztskb.supabase.co:5432/postgres
   ```
   ⚠️ **IMPORTANT**: Ne jamais commiter ce fichier `.env` car il contient des informations sensibles!

## Démarrage

```
npm start
```

Le serveur démarre sur le port 5000 par défaut. Vous pouvez modifier le port en ajoutant une variable `PORT` dans votre fichier `.env`.

## Points d'entrée API

- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit spécifique
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

## Structure du projet

- `server.js` - Point d'entrée principal
- `routes/` - Définition des routes API
- `models/` - Modèles de données
- `db/` - Configuration et scripts de base de données 