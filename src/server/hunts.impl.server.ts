import { ObjectId } from "mongodb";
import { ensureSeedHunts, huntsCollection } from "@/lib/db";
import { serializeHunt } from "@/lib/mongo-json";
import type { HuntDoc } from "@/lib/types";
import { requireAdminImpl } from "./auth.impl.server";

export async function listPublicHuntsImpl() {
  await ensureSeedHunts();
  const hunts = await huntsCollection();
  const docs = await hunts.find({ published: true }).sort({ status: 1, country: 1 }).toArray();
  return docs.map((d) => serializeHunt(d));
}

export async function getHuntBySlugImpl(slug: string) {
  await ensureSeedHunts();
  const hunts = await huntsCollection();
  const doc = await hunts.findOne({ slug, published: true });
  if (!doc) return null;
  return serializeHunt(doc);
}

export async function listAdminHuntsImpl() {
  await requireAdminImpl();
  await ensureSeedHunts();
  const hunts = await huntsCollection();
  const docs = await hunts.find().sort({ updatedAt: -1 }).toArray();
  return docs.map((d) => serializeHunt(d));
}

export async function saveAdminHuntImpl(hunt: Omit<HuntDoc, "_id"> & { id?: string }) {
  await requireAdminImpl();
  const hunts = await huntsCollection();
  const now = Date.now();
  const payload: HuntDoc = {
    slug: hunt.slug || hunt.name.toLowerCase().replace(/\s+/g, "-"),
    name: hunt.name,
    country: hunt.country,
    city: hunt.city,
    description: hunt.description,
    status: hunt.status,
    priceCents: hunt.priceCents,
    currency: hunt.currency || "eur",
    durationLabel: hunt.durationLabel,
    playersLabel: hunt.playersLabel,
    locationLabel: hunt.locationLabel,
    published: hunt.published,
    steps: hunt.steps,
    createdAt: hunt.createdAt || now,
    updatedAt: now,
  };

  if (hunt.id && ObjectId.isValid(hunt.id)) {
    await hunts.updateOne({ _id: new ObjectId(hunt.id) }, { $set: payload });
    return { id: hunt.id };
  }

  if (payload.slug) {
    const existing = await hunts.findOne({ slug: payload.slug });
    if (existing?._id) {
      await hunts.updateOne({ _id: existing._id }, { $set: payload });
      return { id: existing._id.toString() };
    }
  }

  const result = await hunts.insertOne(payload);
  return { id: result.insertedId.toString() };
}

export async function deleteAdminHuntImpl(id: string) {
  await requireAdminImpl();
  if (!ObjectId.isValid(id)) throw new Error("Invalid hunt id");
  const hunts = await huntsCollection();
  await hunts.deleteOne({ _id: new ObjectId(id) });
  return { ok: true };
}
