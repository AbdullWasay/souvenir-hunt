import { createServerFn } from "@tanstack/react-start";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: { huntSlug: string; email: string; name: string }) => data)
  .handler(async ({ data }) => {
    const { createCheckoutSessionImpl } = await import("./checkout.impl.server");
    return createCheckoutSessionImpl(data);
  });

export const fulfillCheckoutSession = createServerFn({ method: "GET" })
  .inputValidator((sessionId: string) => sessionId)
  .handler(async ({ data: sessionId }) => {
    const { fulfillCheckoutSessionImpl } = await import("./checkout.impl.server");
    return fulfillCheckoutSessionImpl(sessionId);
  });

export const getOrderByAccessToken = createServerFn({ method: "GET" })
  .inputValidator((token: string) => token.trim().toUpperCase())
  .handler(async ({ data: token }) => {
    const { getOrderByAccessTokenImpl } = await import("./checkout.impl.server");
    return getOrderByAccessTokenImpl(token);
  });

export const findResumeForHunt = createServerFn({ method: "GET" })
  .inputValidator((data: { huntSlug: string; email?: string }) => data)
  .handler(async ({ data }) => {
    const { findResumeForHuntImpl } = await import("./checkout.impl.server");
    return findResumeForHuntImpl(data);
  });

export const saveHuntProgress = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      accessToken: string;
      currentStepIndex: number;
      completedStepIds: string[];
      introCompleted?: boolean;
      revealedHints?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { saveHuntProgressImpl } = await import("./checkout.impl.server");
    return saveHuntProgressImpl(data);
  });

export const closeHuntProgress = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string; pin: string }) => data)
  .handler(async ({ data }) => {
    const { closeHuntProgressImpl } = await import("./checkout.impl.server");
    return closeHuntProgressImpl(data);
  });

export const getStaffCloseContext = createServerFn({ method: "GET" })
  .inputValidator((token: string) => token.trim().toUpperCase())
  .handler(async ({ data: token }) => {
    const { getStaffCloseContextImpl } = await import("./checkout.impl.server");
    return getStaffCloseContextImpl(token);
  });
