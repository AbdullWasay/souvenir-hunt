import { createServerFn } from "@tanstack/react-start";

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSessionImpl } = await import("./auth.impl.server");
  return getAdminSessionImpl();
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { adminLoginImpl } = await import("./auth.impl.server");
    return adminLoginImpl(data);
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminLogoutImpl } = await import("./auth.impl.server");
  return adminLogoutImpl();
});
