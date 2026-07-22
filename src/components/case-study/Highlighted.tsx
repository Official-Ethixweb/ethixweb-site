/** Splits `text` on the first occurrence of `highlight` and wraps that
 * substring in the accent color. Data files supply plain strings (no JSX),
 * so every case-study heading goes through this to get its one colored
 * phrase - e.g. title="The who, what, and how?" highlight="how?". */
export function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const i = text.indexOf(highlight);
  if (i === -1) return <>{text}</>;
  const before = text.slice(0, i);
  const after = text.slice(i + highlight.length);
  return (
    <>
      {before}
      <span className="text-primary-text">{highlight}</span>
      {after}
    </>
  );
}
