import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reviews")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "reviews" });
  },
});
