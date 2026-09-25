```mermaid
sequenceDiagram
    actor Utilisateur
    participant Frontend
    participant Backend
    participant MongoDB

    Utilisateur->>Frontend: Ouvrir le Dashboard
    Frontend->>Backend: GET /api/products
    Backend->>MongoDB: Récupérer les produits
    MongoDB-->>Backend: Liste des produits
    Backend-->>Frontend: Produits avec leur statut

    Frontend->>Frontend: Vérifier les dates d'expiration

    alt Produit bientôt expiré
        Frontend-->>Utilisateur: Afficher alerte "Bientôt expiré"
    else Produit expiré
        Frontend-->>Utilisateur: Afficher alerte "Produit expiré"
    else Produit valide
        Frontend-->>Utilisateur: Afficher statut "Valide"
    end