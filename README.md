# École Connect - Système de Gestion Éducatif

Une application complète de gestion éducative avec authentification privée, gestion des rôles, et suivi académique complet utilisant React et une architecture moderne.

## 🚀 Fonctionnalités

### Authentification & Sécurité
- ✅ Authentification privée (pas d'inscription publique)
- ✅ Système de rôles à 4 niveaux : Admin, Professeur, Élève, Parent
- ✅ Création d'utilisateurs hiérarchique (Admin → Professeur → Élève)
- ✅ Changement de mot de passe obligatoire au premier login
- ✅ Sessions sécurisées avec gestion des permissions

### Gestion des Utilisateurs
- ✅ Tableau de bord admin pour créer/gérer les professeurs
- ✅ Interface professeur pour gérer les élèves
- ✅ Gestion des permissions par rôle
- ✅ Suivi de l'activité des utilisateurs
- ✅ Profils utilisateur complets

### Système Académique
- ✅ Gestion des groupes et matières
- ✅ Attribution des professeurs aux groupes/matières
- ✅ Système de supports de cours (upload de fichiers)
- ✅ Gestion des notes et évaluations
- ✅ Graphiques de progression et statistiques
- ✅ Système de commentaires modérés

### Interface Utilisateur
- ✅ Design professionnel avec Tailwind CSS
- ✅ Interface responsive (mobile/tablette/desktop)
- ✅ Mode sombre/clair avec persistance
- ✅ Notifications toast pour feedback utilisateur
- ✅ Tableaux de bord personnalisés par rôle
- ✅ Navigation adaptative selon les permissions

## 🛠️ Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Wouter** pour le routing
- **React Hook Form** + **Zod** pour la gestion des formulaires
- **TanStack Query** pour la gestion des données
- **Recharts** pour les graphiques
- **Radix UI** pour les composants accessibles

### Backend
- **Node.js** avec Express
- **TypeScript** pour la sécurité des types
- **Sessions** avec express-session
- **bcrypt** pour le hachage des mots de passe
- **Architecture en couches** (Routes → Storage → Schema)

### Base de données
- **PostgreSQL** (compatible Supabase)
- **Drizzle ORM** pour les requêtes typées
- **Schéma relationnel** avec contraintes
- **Row Level Security** prêt (Supabase)

### Sécurité
- **Authentification par sessions**
- **Hachage des mots de passe** avec bcrypt
- **Validation des données** avec Zod
- **Contrôle d'accès basé sur les rôles**
- **Middleware de sécurité**

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL ou Supabase
- npm ou yarn

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd ecole-connect
npm install
