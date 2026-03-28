<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Tounes Check 🇹🇳

L'assistant IA tunisien : Fact Check, Resto Check, Soum Check.

## 🚀 Stack Technique

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API
- **Analytics:** Mixpanel
- **Error Tracking:** Sentry
- **PWA:** Workbox (offline-first, caching intelligent)
- **Native Apps:** Capacitor (iOS + Android)
- **CI/CD:** GitHub Actions

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Copie `.env.example` vers `.env.local` et remplis tes clés API :

```bash
cp .env.example .env.local
```

Variables requises :
- `GEMINI_API_KEY` : ta clé Google Gemini
- `VITE_MIXPANEL_TOKEN` : token Mixpanel (optionnel)
- `VITE_SENTRY_DSN` : DSN Sentry (optionnel)

## 🏃‍♂️ Développement

```bash
npm run dev
```

L'app tourne sur http://localhost:5173

## 🏗️ Build Production

Build complet avec génération d'icones et service worker :

```bash
npm run build:full
```

Cela génère :
- `dist/` → assets compilés
- `public/service-worker.js` → PWA offline
- `public/icons/` → icones de toutes tailles
- `public/offline.html` → page hors-ligne

## 📱 Build Apps Natives

### Initialisation Capacitor (première fois seulement)

```bash
npm run cap:init
```

### Android

```bash
npm run build:android
```

Ouvre Android Studio, build l'APK/AAB, et publie sur Google Play Console.

### iOS

```bash
npm run build:ios
```

Ouvre Xcode, archive, et publie sur App Store Connect.

## ☁️ Déploiement Web (PWA)

La PWA est déployée sur Cloudflare Pages :

1. Push sur `main`
2. GitHub Actions build automatiquement
3. Déploiement sur Pages (via Secrets CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID)

## 📊 Monitoring

- **Mixpanel:** Analytics comportementales
- **Sentry:** Erreurs en temps réel (uniq. en production)

## 🔧 PWA Features

- Service Worker avec Workbox
- Offline-first (cache persistant)
- Pre-caching des assets
- Stale-while-revalidate pour API Gemini
- Cache long terme pour images
- Shortcuts natifs (3 modes d'usage)
- Splash screens, icones multiples
- Support iOS/Android natte via Capacitor

## 📁 Structure du projet

```
tounes-check/
├── public/
│   ├── icons/            # Icones générées (72,96,128,144,152,192,384,512)
│   ├── offline.html      # Page hors-ligne
│   ├── manifest.json     # PWA manifest
│   └── service-worker.js # Généré par Workbox
├── src/
│   ├── components/       # Composants React
│   ├── pages/           # Pages
│   ├── services/        # Services (Gemini, Mixpanel)
│   ├── utils/           # Utilitaires (storage, sentry)
│   └── init.ts          # Initialisation SW + Sentry
├── scripts/
│   ├── generate-sw.js   # Génère SW avec cache strategies
│   └── generate-icons.js# Génère icones multiples
├── .github/workflows/   # CI/CD
├── capacitor.config.ts  # Config Capacitor
├── store-metadata.json  # Métadonnées stores
└── package.json
```

## 🛠️ Optimisations Performances

- Code splitting automatique (React 19 + Vite)
- Lazy loading des composants
- Images responsive (WebP/AVIF)
- Bundle analyzer (ajouter `npm run build -- --report`)
- Service Worker avec pré-caching
- DNS prefetch, preload critiques

## 🔒 Sécurité

- Gemini API key stockée côté serveur (Cloudflare env)
- Pas d'exposition de clés dans le code client
- Content Security Policy recommandé pour prod
- HTTPS obligatoire pour PWA

## 📈 Roadmap

- [x] PWA complète avec offline
- [x] Service Worker Workbox
- [x] Capacitor (iOS/Android)
- [x] CI/CD GitHub Actions
- [x] Sentry error tracking
- [x] Optimisation images
- [ ] Push notifications natives
- [ ] OTA updates ( Capacitor )
- [ ] A/B testing framework
- [ ] Referral system
- [ ] Monetisation (stripe/subscriptions)

## 🤝 Contributing

Les PR sont les bienvenues ! Voir `CONTRIBUTING.md`.

## 📄 License

MIT © 2025 Tounes Check
