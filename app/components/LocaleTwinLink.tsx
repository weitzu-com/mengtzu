import { localeTwin, type Locale } from "../lib/site";

export function LocaleTwinLink({
  locale,
  path,
}: {
  locale: Locale;
  path: string;
}) {
  const twin = localeTwin(locale, path);

  return (
    <a className="text-link" href={twin.href} hrefLang={twin.hrefLang}>
      {twin.label}
    </a>
  );
}
