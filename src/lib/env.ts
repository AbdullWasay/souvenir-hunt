function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || undefined;
  }
  return trimmed || undefined;
}

function optional(name: string): string | undefined {
  return cleanEnvValue(process.env[name]);
}

export const env = {
  get mongoUri() {
    return required("MONGODB_URI");
  },
  get adminEmail() {
    return required("ADMIN_EMAIL");
  },
  get adminPassword() {
    return required("ADMIN_PASSWORD");
  },
  get adminSessionSecret() {
    return required("ADMIN_SESSION_SECRET");
  },
  get stripeSecretKey() {
    return optional("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return optional("STRIPE_WEBHOOK_SECRET");
  },
  get appUrl() {
    return optional("APP_URL") ?? "http://localhost:5173";
  },
  get resendApiKey() {
    return optional("RESEND_API_KEY");
  },
  get fromEmail() {
    return optional("FROM_EMAIL") ?? "noreply@souvenirhunt.co";
  },
  get mailtrapApiToken() {
    return optional("MAILTRAP_API_TOKEN");
  },
  get mailtrapSenderEmail() {
    return optional("MAILTRAP_SENDER_EMAIL");
  },
};
