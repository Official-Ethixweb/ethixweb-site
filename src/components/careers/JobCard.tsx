import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Briefcase, MapPin, Clock, IndianRupee, ArrowUpRight } from "lucide-react";
import { WebSpotlight } from "@/components/WebSpotlight";
import { trackWebSpotlight } from "@/lib/web-spotlight";
import type { Job } from "@/lib/careers-data";

// Kept low on purpose: the tilt should read as "the card is alive under my
// cursor", not as a gimmick that makes the text hard to read.
const MAX_TILT_DEG = 4;
const SHOWN_SKILLS = 5;

export function JobCard({ job }: { job: Job }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position within the card, -0.5..0.5 on both axes.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT_DEG, -MAX_TILT_DEG]), {
    stiffness: 220,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT_DEG, MAX_TILT_DEG]), {
    stiffness: 220,
    damping: 18,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    trackWebSpotlight(e);
    if (reduceMotion) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return;
    px.set((e.clientX - r.x) / r.width - 0.5);
    py.set((e.clientY - r.y) / r.height - 0.5);
  }

  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }

  const shownSkills = job.skills.slice(0, SHOWN_SKILLS);
  const moreSkills = job.skills.length - shownSkills.length;

  return (
    // The perspective wrapper must be the tilted element's parent, so the
    // rotateX/rotateY read as 3D depth instead of a flat skew.
    <div className="h-full" style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        className="group glass web-card relative flex h-full flex-col rounded-3xl p-7 ring-1 ring-transparent transition-[background-color,box-shadow] hover:bg-white/[0.06] hover:ring-primary/30"
      >
        <WebSpotlight />

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-text">
            {job.department}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4.5 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Actively hiring
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-snug">{job.title}</h3>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary/70" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary/70" /> {job.type}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-primary/70" /> {job.experience}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4 text-primary/70" /> {job.salary}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

        <div className="mt-5 flex flex-1 flex-wrap content-start gap-2">
          {shownSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/4.5 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary/20"
            >
              {skill}
            </span>
          ))}
          {moreSkills > 0 && (
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary-text">
              +{moreSkills} more
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <Link
            to="/careers/apply"
            search={{ role: job.id }}
            className="magnetic inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Apply Now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
          <Link
            to="/careers/$slug"
            params={{ slug: job.slug }}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            View Details
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
