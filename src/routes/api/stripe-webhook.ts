import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { env } from "@/lib/env";
import { ordersCollection, progressCollection } from "@/lib/db";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = env.stripeWebhookSecret;
        const stripeKey = env.stripeSecretKey;
        if (!secret || !stripeKey) {
          return new Response("Stripe webhook not configured", { status: 501 });
        }

        const stripe = new Stripe(stripeKey);
        const body = await request.text();
        const sig = request.headers.get("stripe-signature");
        if (!sig) return new Response("Missing signature", { status: 400 });

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(body, sig, secret);
        } catch {
          return new Response("Invalid signature", { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId;
          const accessToken = session.metadata?.accessToken;
          if (orderId && accessToken && session.payment_status === "paid") {
            const orders = await ordersCollection();
            const oid = new ObjectId(orderId);
            const order = await orders.findOne({ _id: oid });
            if (order && order.status !== "paid") {
              await orders.updateOne(
                { _id: oid },
                { $set: { status: "paid", paidAt: Date.now(), stripeSessionId: session.id } },
              );
              const progress = await progressCollection();
              const existing = await progress.findOne({ accessToken });
              if (!existing) {
                await progress.insertOne({
                  orderId,
                  accessToken,
                  huntId: order.huntId,
                  currentStepIndex: 0,
                  completedStepIds: [],
                  updatedAt: Date.now(),
                });
              }
            }
          }
        }

        return new Response(JSON.stringify({ received: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
