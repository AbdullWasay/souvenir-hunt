import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/artists")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "artists" });
  },
});
