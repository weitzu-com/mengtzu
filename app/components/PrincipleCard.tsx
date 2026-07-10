import { localPath, type Locale, type Principle } from "../lib/site";

export function PrincipleCard({
  locale,
  principle,
}: {
  locale: Locale;
  principle: Principle;
}) {
  const content = principle[locale];

  return (
    <a className="principle-card" href={localPath(locale, `/principles/${principle.slug}`)}>
      <span>{content.shortTitle}</span>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
      <small>{principle.sourceRef}</small>
    </a>
  );
}
