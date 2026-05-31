import Stripe from "stripe";
import { randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { ensureSeedHunts, huntsCollection, ordersCollection, progressCollection } from "@/lib/db";
import { env } from "@/lib/env";
import { toJson } from "@/lib/mongo-json";
import { normalizeSteps } from "@/lib/hunt-utils";
import { isHuntBookable } from "@/lib/types";

function stripeClient() {
  const key = env.stripeSecretKey;
  if (!key) throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to .env");
  return new Stripe(key);
}

function generateAccessToken() {
  return `HUNT-${randomBytes(4).toString("hex").toUpperCase()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function sendTransactionalEmail(data: {
  to: string;
  subject: string;
  html: string;
  category: string;
  devFallback?: string;
}) {
  if (env.mailtrapApiToken && env.mailtrapSenderEmail) {
    const mailtrapRes = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Api-Token": env.mailtrapApiToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: env.mailtrapSenderEmail,
          name: "Souvenir Hunt",
        },
        to: [{ email: data.to }],
        subject: data.subject,
        html: data.html,
        category: data.category,
      }),
    });

    if (!mailtrapRes.ok) {
      const body = await mailtrapRes.text();
      console.error("Mailtrap email failed:", body);
      console.error(
        "Check MAILTRAP_API_TOKEN (Sending → Domains → Integration → API) and MAILTRAP_SENDER_EMAIL (must match a verified domain).",
      );
      if (process.env.NODE_ENV !== "production" && data.devFallback) {
        console.info("Dev email fallback:", data.devFallback);
      }
    }
    return;
  }

  if (env.resendApiKey) {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.fromEmail,
        to: [data.to],
        subject: data.subject,
        html: data.html,
      }),
    });

    if (!resendRes.ok) {
      const body = await resendRes.text();
      console.error("Resend email failed:", body);
    }
    return;
  }

  console.warn("No email provider configured; skipping transactional email.");
  if (process.env.NODE_ENV !== "production" && data.devFallback) {
    console.info("Dev email fallback:", data.devFallback);
  }
}

async function sendPlayLinkEmail(data: {
  to: string;
  name: string;
  playUrl: string;
  accessToken: string;
  huntName: string;
}) {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; line-height:1.6; color:#111827">
      <h2>Your hunt is ready</h2>
      <p>Hi ${data.name},</p>
      <p>Your payment was successful for <strong>${data.huntName}</strong>.</p>
      <p><a href="${data.playUrl}" style="display:inline-block;padding:12px 18px;background:#0b63ff;color:white;border-radius:999px;text-decoration:none;">Start your hunt</a></p>
      <p>Access code: <strong>${data.accessToken}</strong></p>
      <p>If the button doesn't work, copy this link:<br/>${data.playUrl}</p>
    </div>
  `;

  await sendTransactionalEmail({
    to: data.to,
    subject: `Your ${data.huntName} play link`,
    html,
    category: "checkout",
    devFallback: data.playUrl,
  });
}

async function sendHuntCompleteEmail(data: {
  to: string;
  name: string;
  huntName: string;
  gameId: string;
}) {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; line-height:1.6; color:#111827">
      <h2>Hunt complete — souvenir confirmed</h2>
      <p>Hi ${data.name},</p>
      <p>Staff has confirmed your souvenir pickup for <strong>${data.huntName}</strong>.</p>
      <p>Your hunt is officially complete. Thanks for exploring with Souvenir Hunt!</p>
      <p style="color:#6b7280;font-size:14px;">Game ID: ${data.gameId}</p>
    </div>
  `;

  await sendTransactionalEmail({
    to: data.to,
    subject: `${data.huntName} — hunt complete`,
    html,
    category: "hunt-complete",
    devFallback: `Hunt complete email for ${data.name} (${data.gameId})`,
  });
}

export async function createCheckoutSessionImpl(data: {
  huntSlug: string;
  email: string;
  name: string;
}) {
  await ensureSeedHunts();
  const hunts = await huntsCollection();
  const hunt = await hunts.findOne({ slug: data.huntSlug, published: true });
  if (!hunt || !isHuntBookable(hunt.status)) {
    throw new Error("This hunt is not available for purchase yet.");
  }

  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();
  if (!email || !name) throw new Error("Email and name are required.");

  const accessToken = generateAccessToken();
  const orders = await ordersCollection();
  const order = {
    huntId: hunt._id!.toString(),
    huntSlug: hunt.slug,
    email,
    name,
    status: "pending" as const,
    accessToken,
    createdAt: Date.now(),
  };

  const inserted = await orders.insertOne(order);
  const orderId = inserted.insertedId.toString();

  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: hunt.currency,
          unit_amount: hunt.priceCents,
          product_data: {
            name: hunt.name,
            description: `${hunt.city}, ${hunt.country}`,
          },
        },
      },
    ],
    metadata: { orderId, huntSlug: hunt.slug, accessToken },
    success_url: `${env.appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.appUrl}/checkout/${hunt.slug}`,
  });

  await orders.updateOne({ _id: inserted.insertedId }, { $set: { stripeSessionId: session.id } });

  return { url: session.url!, orderId };
}

export async function fulfillCheckoutSessionImpl(sessionId: string) {
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { paid: false as const };
  }

  const orderId = session.metadata?.orderId;
  const accessToken = session.metadata?.accessToken;
  if (!orderId || !accessToken) throw new Error("Invalid checkout session");

  const orders = await ordersCollection();
  const oid = new ObjectId(orderId);
  const order = await orders.findOne({ _id: oid });
  if (!order) throw new Error("Order not found");

  if (order.status !== "paid") {
    await orders.updateOne(
      { _id: oid },
      { $set: { status: "paid", paidAt: Date.now(), stripeSessionId: sessionId } },
    );

    const progress = await progressCollection();
    await progress.insertOne({
      orderId,
      accessToken,
      huntId: order.huntId,
      currentStepIndex: 0,
      completedStepIds: [],
      updatedAt: Date.now(),
    });

    const playUrl = `${env.appUrl}/play/${accessToken}`;
    await sendPlayLinkEmail({
      to: order.email,
      name: order.name,
      playUrl,
      accessToken,
      huntName: order.huntSlug,
    });
  }

  const playUrl = `${env.appUrl}/play/${accessToken}`;
  return {
    paid: true as const,
    email: order.email,
    name: order.name,
    huntSlug: order.huntSlug,
    accessToken,
    playUrl,
  };
}

export async function getOrderByAccessTokenImpl(token: string) {
  await ensureSeedHunts();

  const normalized = token.trim().toUpperCase();
  const orders = await ordersCollection();
  const order = await orders.findOne({ accessToken: normalized, status: "paid" });
  if (!order) return null;

  const hunts = await huntsCollection();
  const hunt = await hunts.findOne({ _id: new ObjectId(order.huntId) });
  if (!hunt) return null;

  const progress = await progressCollection();
  const prog = await progress.findOne({ accessToken: normalized });

  return toJson({
    order: {
      email: order.email,
      name: order.name,
      huntSlug: order.huntSlug,
      accessToken: order.accessToken,
    },
    hunt: {
      slug: hunt.slug,
      name: hunt.name,
      country: hunt.country,
      city: hunt.city,
      heroImageUrl: hunt.heroImageUrl,
      locationLabel: hunt.locationLabel,
      steps: normalizeSteps(hunt.steps),
    },
    progress: prog
      ? {
          currentStepIndex: prog.currentStepIndex,
          completedStepIds: prog.completedStepIds ?? [],
          introCompleted: Boolean(prog.introCompleted) || prog.currentStepIndex > 0 || (prog.completedStepIds?.length ?? 0) > 0,
          revealedHints: prog.revealedHints ?? 0,
          closedAt: prog.closedAt,
        }
      : {
          currentStepIndex: 0,
          completedStepIds: [] as string[],
          introCompleted: false,
          revealedHints: 0,
          closedAt: undefined,
        },
    staffCloseUrl: `${env.appUrl}/staff/close/${normalized}`,
  });
}

export async function getStaffCloseContextImpl(token: string) {
  const normalized = token.trim().toUpperCase();
  const orders = await ordersCollection();
  const order = await orders.findOne({ accessToken: normalized, status: "paid" });
  if (!order) return null;

  const hunts = await huntsCollection();
  const hunt = await hunts.findOne({ _id: new ObjectId(order.huntId) });
  if (!hunt) return null;

  const progress = await progressCollection();
  const prog = await progress.findOne({ accessToken: normalized });

  return toJson({
    accessToken: order.accessToken,
    playerName: order.name,
    huntName: hunt.name,
    gameId: order.accessToken.slice(5, 13).toUpperCase(),
    alreadyClosed: Boolean(prog?.closedAt),
  });
}

export async function findResumeForHuntImpl(data: { huntSlug: string; email?: string }) {
  if (!data.email) return null;
  const email = data.email.trim().toLowerCase();
  const orders = await ordersCollection();
  const order = await orders.findOne({
    huntSlug: data.huntSlug,
    email,
    status: "paid",
  });
  if (!order) return null;
  return {
    accessToken: order.accessToken,
    playUrl: `${env.appUrl}/play/${order.accessToken}`,
  };
}

export async function saveHuntProgressImpl(data: {
  accessToken: string;
  currentStepIndex: number;
  completedStepIds: string[];
  introCompleted?: boolean;
  revealedHints?: number;
}) {
  const token = data.accessToken.trim().toUpperCase();
  const orders = await ordersCollection();
  const order = await orders.findOne({ accessToken: token, status: "paid" });
  if (!order) throw new Error("Invalid or unpaid access code");

  const progress = await progressCollection();
  const $set: Record<string, unknown> = {
    currentStepIndex: data.currentStepIndex,
    completedStepIds: data.completedStepIds,
    updatedAt: Date.now(),
  };
  if (data.introCompleted !== undefined) $set.introCompleted = data.introCompleted;
  if (data.revealedHints !== undefined) $set.revealedHints = data.revealedHints;

  await progress.updateOne(
    { accessToken: token },
    {
      $set,
      $setOnInsert: {
        orderId: order._id?.toString() ?? "",
        accessToken: token,
        huntId: order.huntId,
      },
    },
    { upsert: true },
  );
  return { ok: true };
}

export async function closeHuntProgressImpl(data: { accessToken: string; pin: string }) {
  const token = data.accessToken.trim().toUpperCase();
  const pin = data.pin.trim();
  if (pin !== "1234") throw new Error("Invalid staff PIN");

  const orders = await ordersCollection();
  const order = await orders.findOne({ accessToken: token, status: "paid" });
  if (!order) throw new Error("Invalid or unpaid access code");

  const progress = await progressCollection();
  const existing = await progress.findOne({ accessToken: token });
  if (existing?.closedAt) {
    return { ok: true, alreadyClosed: true };
  }

  await progress.updateOne(
    { accessToken: token },
    {
      $set: {
        closedAt: Date.now(),
        updatedAt: Date.now(),
      },
      $setOnInsert: {
        orderId: order._id?.toString() ?? "",
        huntId: order.huntId,
        currentStepIndex: 0,
        completedStepIds: [],
      },
    },
    { upsert: true },
  );

  await ensureSeedHunts();
  const hunts = await huntsCollection();
  const hunt = ObjectId.isValid(order.huntId)
    ? await hunts.findOne({ _id: new ObjectId(order.huntId) })
    : await hunts.findOne({ slug: order.huntSlug });
  const huntName = hunt?.name ?? "Your hunt";
  const gameId = order.accessToken.slice(5, 13).toUpperCase();

  await sendHuntCompleteEmail({
    to: order.email,
    name: order.name,
    huntName,
    gameId,
  });

  return { ok: true };
}
