import { ObjectId } from "mongodb";
import { normalizeSteps } from "@/lib/hunt-utils";
import type { HuntDoc } from "./types";

/** Strip MongoDB types so TanStack server functions can serialize responses. */
export function toJson<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, val) => {
      if (val instanceof ObjectId) return val.toString();
      return val;
    }),
  ) as T;
}

export type SerializedHunt = HuntDoc & { id: string };

export function serializeHunt(doc: HuntDoc & { _id?: ObjectId }): SerializedHunt {
  const id = doc._id instanceof ObjectId ? doc._id.toString() : doc.slug;
  const now = Date.now();
  return toJson({
    id,
    slug: doc.slug || `hunt-${id}`,
    name: doc.name || "Untitled Hunt",
    country: doc.country || "",
    city: doc.city || "",
    heroImageUrl: doc.heroImageUrl || "",
    description: doc.description || "",
    status: doc.status || "coming_soon",
    priceCents: doc.priceCents ?? 0,
    currency: doc.currency || "eur",
    durationLabel: doc.durationLabel || "1.5–2 hrs",
    playersLabel: doc.playersLabel || "1–6 players",
    locationLabel: doc.locationLabel || "",
    published: doc.published ?? false,
    steps: normalizeSteps(Array.isArray(doc.steps) ? doc.steps : []),
    createdAt: doc.createdAt ?? now,
    updatedAt: doc.updatedAt ?? now,
  });
}
