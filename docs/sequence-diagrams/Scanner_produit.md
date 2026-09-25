```mermaid
sequenceDiagram
    actor Utilisateur
    participant Frontend
    participant Camera
    participant OpenFoodFacts
    participant Backend
    participant MongoDB

    Utilisateur->>Frontend: Cliquer sur Scanner
    Frontend->>Camera: Demander accès caméra

    alt Permission accordée
        Camera-->>Frontend: Code-barres détecté
        Frontend->>OpenFoodFacts: Rechercher le code-barres
        OpenFoodFacts-->>Frontend: Informations du produit
        Frontend-->>Utilisateur: Afficher nom du produit
        Utilisateur->>Frontend: Compléter les informations
        Frontend->>Backend: POST /api/products
        Backend->>MongoDB: Enregistrer le produit
        MongoDB-->>Backend: Produit enregistré
        Backend-->>Frontend: Confirmation
        Frontend-->>Utilisateur: Produit ajouté
    else Permission refusée
        Camera-->>Frontend: Accès refusé
        Frontend-->>Utilisateur: Afficher erreur de permission
    end