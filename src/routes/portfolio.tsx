import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pathless layout for everything under /portfolio (index, $slug). It renders
// nothing of its own - each child route brings its own full page (including
// its own SiteLayout) - but the file must exist so the route generator has a
// concrete parent to attach /portfolio/ and /portfolio/$slug to instead of
// inferring a dangling one. Mirrors routes/careers.tsx.
export const Route = createFileRoute("/portfolio")({
  component: Outlet,
});
