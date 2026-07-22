import {
  Wrench,
  Laptop,
  LayoutGrid,
  Server,
  Smartphone,
  ShieldCheck,
  Rocket,
  Zap,
  Target,
  TrendingUp,
  Search,
  Palette,
  Globe,
  Users,
  MessageSquare,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

/** String-keyed icon registry for case study data files. Data stays plain/
 * serializable (an `icon: "wrench"` string, not a component reference) so it
 * can move to JSON/markdown later - this is the only place that maps a key
 * to an actual component. Add new keys here as new case studies need them. */
export const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  laptop: Laptop,
  "layout-grid": LayoutGrid,
  server: Server,
  smartphone: Smartphone,
  "shield-check": ShieldCheck,
  rocket: Rocket,
  zap: Zap,
  target: Target,
  "trending-up": TrendingUp,
  search: Search,
  palette: Palette,
  globe: Globe,
  users: Users,
  "message-square": MessageSquare,
  "bar-chart": BarChart3,
};

export function getIcon(key: string | undefined): LucideIcon {
  return (key && ICON_MAP[key]) || Zap;
}
