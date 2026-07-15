import { Activity, TrendingUp, Wrench } from "lucide-react";

// Static data tables for the GlobalNetwork globe visualization - split out of
// GlobalNetwork.tsx (which mixes data, geo math, a clock subsystem, and
// several sub-components) so the data can be read/edited independent of the
// canvas rendering logic.

export type City = {
  name: string;
  lat: number;
  lon: number;
  tier: "primary" | "secondary" | "hub";
  tz: string;
};
export type Packet = { route: number; p: number; speed: number; opacity: number; r: number };

export const CITIES: City[] = [
  { name: "Seattle", lat: 47.6, lon: -122.3, tier: "primary", tz: "America/Los_Angeles" },
  { name: "Utah", lat: 40.76, lon: -111.89, tier: "primary", tz: "America/Denver" },
  { name: "New York", lat: 40.71, lon: -74.0, tier: "primary", tz: "America/New_York" },
  { name: "Canada", lat: 43.65, lon: -79.38, tier: "secondary", tz: "America/Toronto" },
  { name: "United Kingdom", lat: 51.5, lon: -0.12, tier: "secondary", tz: "Europe/London" },
  { name: "India", lat: 12.97, lon: 77.59, tier: "hub", tz: "Asia/Kolkata" },
];

export const ROUTES: [string, string][] = [
  ["India", "Seattle"],
  ["India", "Utah"],
  ["India", "New York"],
  ["India", "United Kingdom"],
  ["India", "Canada"],
  ["Seattle", "Utah"],
  ["Seattle", "New York"],
  ["Seattle", "Canada"],
  ["Seattle", "United Kingdom"],
  ["Utah", "New York"],
  ["Utah", "Canada"],
  ["New York", "Canada"],
  ["New York", "United Kingdom"],
  ["Canada", "United Kingdom"],
];

export const GHOST_ROUTES: [string, string, number, boolean][] = [
  ["India", "Seattle", 0.8, false],
  ["India", "Seattle", 0.28, true],
  ["India", "New York", 0.74, false],
  ["India", "United Kingdom", 0.64, false],
  ["India", "Canada", 0.84, false],
  ["India", "Utah", 0.72, false],
  ["Seattle", "United Kingdom", 0.7, false],
  ["Seattle", "New York", 0.58, true],
  ["New York", "United Kingdom", 0.62, false],
  ["Canada", "United Kingdom", 0.66, false],
  ["India", "New York", 0.44, true],
  ["India", "Seattle", 0.52, true],
];

export const CLOCKS = [
  { label: "India Hub", tz: "Asia/Kolkata" },
  { label: "Seattle", tz: "America/Los_Angeles" },
  { label: "Utah", tz: "America/Denver" },
  { label: "New York", tz: "America/New_York" },
  { label: "Canada", tz: "America/Toronto" },
  { label: "UK", tz: "Europe/London" },
];

export const STATUS_CARDS = [
  {
    city: "Seattle",
    icon: Activity,
    label: "Active Projects",
    tz: "America/Los_Angeles",
    tone: "emerald",
  },
  {
    city: "Utah",
    icon: Wrench,
    label: "Maintenance & Support",
    tz: "America/Denver",
    tone: "amber",
  },
  {
    city: "New York",
    icon: TrendingUp,
    label: "Strategy & Growth",
    tz: "America/New_York",
    tone: "emerald",
  },
];

export const METRICS = [
  { v: "50+", l: "Projects Delivered", d: "Live websites, apps, and automations delivered." },
  { v: "<1h", l: "Avg. Response Time", d: "Real replies within the hour, always." },
  { v: "US First", l: "Operations Focus", d: "Proudly based in the United States." },
  { v: "24/7", l: "Global Availability", d: "Around-the-clock support, every day, everywhere." },
];
