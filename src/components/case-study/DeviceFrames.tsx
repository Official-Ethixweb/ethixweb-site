import type { ReactNode } from "react";

/** Subtle glass-reflection sheen, shared by all three frames - low opacity,
 * one diagonal band, never a "glossy plastic" look. */
function Sheen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background:
          "linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.16) 50%, transparent 58%)",
      }}
    />
  );
}

const SHADOW =
  "0 2px 4px rgba(0,0,0,0.18), 0 10px 20px -6px rgba(0,0,0,0.28), 0 30px 60px -20px rgba(0,0,0,0.35)";

/** Reusable MacBook chrome: aluminum body, thin bezel, camera notch, hinge
 * chin and a suggested keyboard deck below - built entirely in CSS so it
 * works for any case study, no PNG mockup. `children` fills the display
 * edge-to-edge, clipped to the screen's own rounded corners. */
export function MacBookFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto ${className}`} style={{ filter: `drop-shadow(0 0 0 transparent)` }}>
      <div
        className="relative rounded-t-2xl bg-gradient-to-b from-[#eceded] to-[#c7c8ca] p-[3px]"
        style={{ boxShadow: SHADOW }}
      >
        <div className="relative rounded-t-[13px] bg-[#0a0a0a] px-2.5 pb-1.5 pt-2.5">
          <div className="absolute left-1/2 top-1.5 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#161618] ring-1 ring-black/40" />
          <div className="relative aspect-[16/10.4] w-full overflow-hidden rounded-[3px] bg-white">
            {children}
            <Sheen />
          </div>
        </div>
      </div>
      {/* Hinge chin */}
      <div className="relative h-[6px] bg-gradient-to-b from-[#d7d8da] to-[#c1c2c5]">
        <div className="absolute left-1/2 top-0 h-full w-[14%] -translate-x-1/2 bg-[#a3a5a8]" />
      </div>
      {/* Keyboard deck - proportional depth via padding-top (% always
          resolves against width, giving a real height to position the key
          rows/trackpad against), key-row texture + trackpad, no photo needed */}
      <div
        className="relative mx-auto w-[103%] bg-gradient-to-b from-[#dcdde0] to-[#b7b8bb] pt-[22%]"
        style={{
          clipPath: "polygon(0.5% 0, 99.5% 0, 100% 100%, 0% 100%)",
          boxShadow: "inset 0 6px 10px -6px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="absolute left-1/2 top-[14%] h-[42%] w-[88%] -translate-x-1/2 rounded-[3px] opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #9a9ba0 0, #9a9ba0 6.2%, transparent 6.2%, transparent 8%), repeating-linear-gradient(0deg, #9a9ba0 0, #9a9ba0 22%, transparent 22%, transparent 32%)",
          }}
        />
        <div className="absolute left-1/2 top-[66%] h-[26%] w-[24%] -translate-x-1/2 rounded-[6px] bg-black/[0.08] ring-1 ring-black/10" />
      </div>
    </div>
  );
}

/** Reusable iPad chrome: equal-thickness black bezel, rounded shell, slight
 * tilt applied by the caller via `className`/`style` on the wrapper. */
export function IPadFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[26px] bg-gradient-to-b from-[#e9eaec] to-[#c6c7ca] p-2.5 ${className}`}
      style={{ boxShadow: SHADOW }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px] bg-black p-[3px]">
        <div className="absolute left-1/2 top-[7px] z-10 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#2c2c2e]" />
        <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-white">
          {children}
          <Sheen />
        </div>
      </div>
    </div>
  );
}

/** Reusable iPhone chrome: metallic frame, Dynamic Island, tall rounded
 * shell. Rotation/position is applied by the caller. */
export function IPhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[34px] bg-gradient-to-b from-[#4a4a4d] via-[#2c2c2e] to-[#1c1c1e] p-[7px] ${className}`}
      style={{ boxShadow: SHADOW }}
    >
      <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[28px] bg-black">
        <div className="absolute left-1/2 top-[8px] z-10 h-[16px] w-[38%] -translate-x-1/2 rounded-full bg-black" />
        {children}
        <Sheen />
      </div>
    </div>
  );
}
