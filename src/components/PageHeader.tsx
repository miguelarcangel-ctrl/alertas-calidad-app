export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-dpw-primary">
        {eyebrow}
      </p>
      <h1 className="font-condensed text-3xl font-extrabold uppercase leading-tight text-dpw-navy">
        {title}
      </h1>
    </div>
  );
}
