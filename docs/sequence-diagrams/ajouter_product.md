```mermaid
sequenceDiagram
    actor Utilisateur
    participant Frontend
    participant Backend
    participant MongoDB

    Utilisateur->>Frontend: Ouvrir Ajouter un produit
    Utilisateur->>Frontend: Remplir les informations
    Utilisateur->>Frontend: Cliquer sur Ajouter

    Frontend->>Backend: POST /api/products
    Backend->>Backend: Vérifier le token JWT
    Backend->>MongoDB: Enregistrer le produit
    MongoDB-->>Backend: Produit créé
    Backend-->>Frontend: Produit créé
    Frontend-->>Utilisateur: Afficher confirmation