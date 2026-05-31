import { createServerFn } from "@tanstack/react-start";
import type { HuntDoc, StepDoc } from "@/lib/types";

export const listPublicHunts = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublicHuntsImpl } = await import("./hunts.impl.server");
  return listPublicHuntsImpl();
});

export const getHuntBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { getHuntBySlugImpl } = await import("./hunts.impl.server");
    return getHuntBySlugImpl(slug);
  });

export const listAdminHunts = createServerFn({ method: "GET" }).handler(async () => {
  const { listAdminHuntsImpl } = await import("./hunts.impl.server");
  return listAdminHuntsImpl();
});

export const saveAdminHunt = createServerFn({ method: "POST" })
  .inputValidator((hunt: Omit<HuntDoc, "_id"> & { id?: string }) => hunt)
  .handler(async ({ data }) => {
    const { saveAdminHuntImpl } = await import("./hunts.impl.server");
    return saveAdminHuntImpl(data);
  });

export const deleteAdminHunt = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { deleteAdminHuntImpl } = await import("./hunts.impl.server");
    return deleteAdminHuntImpl(id);
  });
