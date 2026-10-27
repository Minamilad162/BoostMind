# Boost Mind — Cloudflare Email Setup (v19)

The public Boost Mind contact email is:

```text
info@boostmind-tech.com
```

Every valid **Start a project** submission is sent to:

```text
bishosamuel@gmail.com
```

The visitor's email is used as **Reply-To**, so pressing Reply on the notification emails the client directly.

## Recommended setup — Cloudflare Email binding

1. In Cloudflare, onboard `boostmind-tech.com` under **Compute → Email Service → Email Sending**.
2. Verify `bishosamuel@gmail.com` as a destination address if your binding configuration requires verified destinations.
3. Add an Email Sending binding named:

```text
EMAIL
```

The application uses `info@boostmind-tech.com` as the default sender. You may override it with:

```text
BOOSTMIND_FROM_EMAIL
```

Optional overrides:

```text
BOOSTMIND_FROM_NAME = Boost Mind Website
BOOSTMIND_NOTIFICATION_EMAIL = bishosamuel@gmail.com
```

## REST API fallback

If you prefer REST API sending, add:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_EMAIL_API_TOKEN
```

The token must have Email Sending permission. If an `EMAIL` binding exists but fails and REST credentials are also configured, v19 automatically tries the REST API fallback.

## Verify after deployment

Open:

```text
https://YOUR-DOMAIN/api/health
```

A ready deployment should report:

```json
{
  "ok": true,
  "contactEmail": "info@boostmind-tech.com",
  "senderEmail": "info@boostmind-tech.com",
  "notificationEmail": "bishosamuel@gmail.com",
  "emailProvider": "binding",
  "emailConfigured": true
}
```

Then submit one real test through **Start a project** on the live Cloudflare deployment and confirm it arrives in Gmail.

> `npm run dev` is only a front-end preview. It intentionally does not send a real email.
