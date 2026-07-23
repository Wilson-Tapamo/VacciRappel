# Rappels et déploiement

## Mise en service

1. Déployer la migration : `npm run db:migrate:deploy`
2. Charger le calendrier précis : `npm run db:seed:schedule`
3. Configurer les variables ci-dessous dans la préproduction Vercel.
4. Vérifier le projet : `npm run build`

La branche `main` est explicitement exclue des déploiements Git Vercel dans `vercel.json`.

## Variables requises

- `CRON_SECRET` : secret long utilisé par Vercel Cron.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` : clé publique Web Push.
- `VAPID_PRIVATE_KEY` : clé privée Web Push, uniquement côté serveur.
- `VAPID_SUBJECT` : contact VAPID, par exemple `mailto:admin@domaine.tld`.

Les clés VAPID peuvent être générées localement avec :

```bash
npx web-push generate-vapid-keys
```

## SMS et WhatsApp

Les intégrations sont découplées du fournisseur. Renseigner une ou deux URL HTTPS :

- `REMINDER_SMS_WEBHOOK_URL`
- `REMINDER_WHATSAPP_WEBHOOK_URL`

Chaque webhook reçoit une requête `POST` JSON :

```json
{
  "to": "+237...",
  "channel": "SMS",
  "title": "Rappel vaccin — Amina",
  "body": "Pentavalent 2 le 26/03/2026.",
  "url": "/alerts"
}
```

Le service destinataire est responsable de l’authentification du fournisseur, du consentement, des modèles WhatsApp approuvés et du suivi de livraison.

## Tâche planifiée

Vercel appelle `/api/cron/reminders` chaque jour à 07:00 UTC. L’API exige `Authorization: Bearer <CRON_SECRET>`, traite au maximum 100 rappels et journalise le résultat dans `ReminderDelivery`.

## Base de données

La migration `20260723140000_product_evolution` ajoute le calendrier par dose/jours, le partage familial, les préférences de rappel, les abonnements Push, les centres, leur disponibilité et les rendez-vous. Elle doit être appliquée avant de tester ces fonctions sur la préproduction.
