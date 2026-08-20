import { localPath, type Locale } from "../lib/site";
import type { BreadcrumbItem } from "../lib/seo";

export function Breadcrumbs({
  locale,
  items,
}: {
  locale: Locale;
  items: BreadcrumbItem[];
}) {
  return (
    <nav className="breadcrumbs" aria-label={locale === "zh" ? "面包屑导航" : "Breadcrumb"}>
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={localPath(locale, item.href)}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
