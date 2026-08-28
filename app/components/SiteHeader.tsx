import {
  alternateLocale,
  localPath,
  navItems,
  pagePaths,
  type Locale,
  type StaticPage,
} from "../lib/site";

type SiteHeaderProps = {
  locale: Locale;
  active: StaticPage | "principle";
  path?: string;
};

export function SiteHeader({ locale, active, path = "" }: SiteHeaderProps) {
  const otherLocale = alternateLocale(locale);
  const switchPath = localPath(otherLocale, path);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {locale === "zh" ? "跳到正文" : "Skip to content"}
      </a>
      <header className="site-header">
        <a className="brand" href={localPath(locale, pagePaths.home)}>
          <span className="brand-mark" aria-hidden="true">孟</span>
          <span>mengtzu.com</span>
        </a>
        <nav className="site-nav" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
          {navItems[locale].map((item) => {
            const key =
              item.href.endsWith("/principles")
                ? "principles"
                : item.href.endsWith("/books")
                  ? "books"
                  : item.href.endsWith("/quotes")
                    ? "quotes"
                    : item.href.endsWith("/method")
                      ? "method"
                      : item.href.endsWith("/about")
                        ? "about"
                        : item.href.endsWith("/sources")
                          ? "sources"
                          : item.href.endsWith("/faq")
                            ? "faq"
                            : "home";
            const isActive = active === key || (active === "principle" && key === "principles");
            return (
              <a key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <a className="language-link" href={switchPath} hrefLang={otherLocale}>
          {otherLocale === "zh" ? "中文" : "English"}
        </a>
      </header>
      <div id="main-content" tabIndex={-1} />
    </>
  );
}
