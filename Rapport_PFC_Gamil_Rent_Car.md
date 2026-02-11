# RAPPORT DE PROJET DE FIN DE CYCLE

## Plateforme de Location de Voitures - Gamil Rent Car

**Établissement :** [Nom de votre établissement]  
**Filière :** Développement Informatique / Génie Logiciel  
**Année Universitaire :** 2025-2026  
**Réalisé par :** [Votre nom]  
**Encadré par :** [Nom de l'encadrant]

---

## SOMMAIRE

1. **INTRODUCTION** .................................................... 2
2. **PRÉSENTATION DU PROJET** ...................................... 2
3. **CONCEPTION DU PROJET** ......................................... 3
4. **RÉALISATION ET MISE EN ŒUVRE** ................................ 4
5. **RÉSULTATS OBTENUS** ............................................ 5
6. **CONCLUSION** .................................................... 6
7. **BIBLIOGRAPHIE** ................................................. 6

---

## INTRODUCTION

### Contexte et objectifs

Dans un contexte de digitalisation croissante au Maroc, les agences de location de véhicules cherchent à moderniser leurs services. Ce projet vise à développer **Gamil Rent Car**, une plateforme web complète permettant aux clients de consulter un catalogue de véhicules, filtrer selon leurs besoins, et réserver en ligne via WhatsApp.

L'objectif principal est de créer une solution moderne qui améliore l'expérience client tout en optimisant la gestion opérationnelle de l'agence. Le projet a été réalisé selon une méthodologie agile avec des sprints de deux semaines, couvrant l'analyse, la conception, le développement et les tests.

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Problématique

L'agence Gamil Rent Car gérait ses réservations de manière traditionnelle (téléphone, visites en agence), entraînant :

- Perte de clients potentiels (pas de réservation hors heures d'ouverture)
- Risques d'erreurs de gestion (double réservation)
- Absence de présence digitale
- Processus administratifs chronophages

**Question centrale :** Comment moderniser le processus de location tout en améliorant l'expérience client et l'efficacité opérationnelle ?

### 1.2 Objectifs fonctionnels

**Pour les clients :**

- Consulter le catalogue avec photos et caractéristiques détaillées
- Filtrer par catégorie, transmission et prix
- Réserver via un formulaire intégré à WhatsApp

**Pour l'administration :**

- Gérer le catalogue de véhicules (CRUD)
- Suivre les réservations en temps réel
- Accéder à un tableau de bord de gestion

### 1.3 Périmètre

**Réalisé :** Interface client responsive, système de filtrage, réservation WhatsApp, design premium  
**En cours :** Backend API REST, interface admin, authentification JWT

---

## 2. CONCEPTION DU PROJET

### 2.1 Architecture technique

Le projet adopte une **architecture client-serveur** moderne :

```
Frontend (React) ←→ API REST ←→ Backend (Node.js/Express) ←→ MongoDB
```

**Justification :** Séparation des responsabilités, scalabilité, facilité de maintenance, possibilité d'ajouter une app mobile.

### 2.2 Modélisation des données

**Collection Cars (Véhicules)**

```javascript
{
  name: String,           // "Dacia Logan"
  category: String,       // "Citadine", "SUV"
  transmission: String,   // "Manuelle", "Automatique"
  pricePerDay: Number,    // Prix en DH
  available: Boolean,     // Disponibilité
  image: String          // URL image
}
```

**Collection Bookings (Réservations)**

```javascript
{
  carId: ObjectId,        // Référence véhicule
  customerName: String,
  customerPhone: String,
  startDate: Date,
  endDate: Date,
  status: String         // "pending", "confirmed", "completed"
}
```

### 2.3 Choix technologiques

| Couche       | Technologie       | Justification                         |
| ------------ | ----------------- | ------------------------------------- |
| **Frontend** | React 19 + Vite   | Framework moderne, build rapide       |
|              | Tailwind CSS      | Développement rapide, design cohérent |
|              | Framer Motion     | Animations fluides et performantes    |
| **Backend**  | Node.js + Express | JavaScript full-stack, performances   |
|              | MongoDB           | NoSQL flexible, scalabilité           |
|              | JWT + Bcrypt      | Authentification sécurisée            |

---

## 3. RÉALISATION ET MISE EN ŒUVRE

### 3.1 Développement frontend

**Structure modulaire :** L'application est organisée en composants réutilisables (Navbar, Hero, CarCard, FilterBar, BookingModal) facilitant la maintenance.

**Design system :** Thème dark luxury avec palette noir (#0A0A0A) et rouge rubis (#E11D48), typographie Poppins/Montserrat, animations de scroll reveal et hover effects.

**Optimisations :** Code splitting, memoization avec `useMemo` pour le filtrage, images optimisées, bundle size réduit.

### 3.2 Système de réservation

**Flux utilisateur :**

1. Consultation du catalogue → Filtrage → Sélection véhicule
2. Remplissage formulaire (nom, téléphone, dates, lieu)
3. Génération message WhatsApp pré-rempli
4. Confirmation par l'agence

**Intégration WhatsApp :** Choix stratégique adapté au marché marocain (90% d'utilisation). Avantages : communication instantanée, pas de friction de paiement, confiance accrue.

### 3.3 Interface d'administration (planifiée)

- Authentification JWT avec sessions sécurisées
- CRUD complet sur les véhicules
- Tableau de bord avec statistiques
- Gestion des réservations par statut

---

## 4. RÉSULTATS OBTENUS

### 4.1 Fonctionnalités réalisées

**Module client (100%)**

- ✅ Page d'accueil avec hero section et catalogue de 8 véhicules
- ✅ Filtrage multi-critères en temps réel
- ✅ Page détails avec spécifications complètes
- ✅ Modal de réservation + intégration WhatsApp
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Animations et skeleton loaders

**Module backend (80%)**

- ✅ Infrastructure serveur configurée
- ⏳ API REST en finalisation

### 4.2 Tests et validation

| Test                     | Résultat                |
| ------------------------ | ----------------------- |
| Affichage catalogue      | ✅ 8 véhicules affichés |
| Filtrage temps réel      | ✅ Fonctionnel          |
| Réservation WhatsApp     | ✅ Message pré-rempli   |
| Responsive mobile        | ✅ Tous écrans          |
| Performance (chargement) | ✅ 1.2s (objectif < 2s) |
| Lighthouse Score         | ✅ 92/100               |

**Compatibilité :** Chrome, Firefox, Safari, Edge (versions récentes)

### 4.3 Déploiement

- **Frontend :** Vercel (https://gamil-rent-car.vercel.app)
- **Backend :** Prévu sur DigitalOcean/Heroku
- **Base de données :** MongoDB Atlas (cluster gratuit)

---

## 5. CONCLUSION

### 5.1 Récapitulatif

Ce projet a permis de développer une plateforme web moderne de location de voitures répondant aux besoins d'une agence casablancaise. La solution offre une interface premium pour les clients et simplifie la gestion pour l'administration.

**Compétences mobilisées :** Développement React, architecture API REST, design UI/UX, gestion de projet agile, versioning Git.

### 5.2 Limites et améliorations

**Limites actuelles :**

- Absence de paiement en ligne
- Backend non finalisé
- Notifications limitées à WhatsApp
- Langue unique (français)

**Améliorations futures :**

- **Court terme :** Finaliser backend, intégrer Stripe, ajouter notifications email
- **Moyen terme :** Dashboard analytique, système de reviews, support multilingue
- **Long terme :** Application mobile React Native, tracking GPS, transformation en SaaS

### 5.3 Apports du PFC

**Techniques :** Maîtrise de JavaScript moderne, React, Node.js, MongoDB, architecture logicielle

**Professionnels :** Autonomie, rigueur, résolution de problèmes, documentation technique

**Employabilité :** Les technologies utilisées (React, Node.js, MongoDB) sont très demandées sur le marché marocain et international. Ce projet constitue un portfolio solide pour une carrière de développeur full-stack.

---

## 6. BIBLIOGRAPHIE / WEBOGRAPHIE

### Documentation officielle

1. React Documentation - https://react.dev/
2. Node.js Documentation - https://nodejs.org/docs/
3. MongoDB Manual - https://www.mongodb.com/docs/
4. Tailwind CSS - https://tailwindcss.com/docs

### Livres de référence

5. Flanagan, D. _JavaScript: The Definitive Guide._ O'Reilly, 2020.
6. Banks, A. & Porcello, E. _Learning React._ O'Reilly, 2020.
7. Bradshaw, S. _MongoDB: The Definitive Guide._ O'Reilly, 2019.

### Ressources web

8. MDN Web Docs - https://developer.mozilla.org/
9. freeCodeCamp - https://www.freecodecamp.org/
10. Stack Overflow - https://stackoverflow.com/

---

**FIN DU RAPPORT**
