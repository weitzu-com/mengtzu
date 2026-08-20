import { RSS_FEED_PATH, SITE_URL, localPath, type Locale } from "../lib/site";

export function SiteFooter({ locale, updatedAt }: { locale: Locale; updatedAt: string }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>mengtzu.com</strong>
        <p>
          {locale === "zh"
            ? "从第一性原理整理孟子思想。"
            : "Mencius explained from first principles."}
        </p>
      </div>
      <nav aria-label={locale === "zh" ? "页脚导航" : "Footer navigation"}>
        <a href={localPath(locale, "/about")}>{locale === "zh" ? "孟子简介" : "About Mencius"}</a>
        <a href={localPath(locale, "/quotes")}>{locale === "zh" ? "名言" : "Quotes"}</a>
        <a href={localPath(locale, "/sources")}>{locale === "zh" ? "来源" : "Sources"}</a>
        <a href={localPath(locale, "/faq")}>{locale === "zh" ? "问答" : "FAQ"}</a>
        <a href={RSS_FEED_PATH}>{locale === "zh" ? "RSS 订阅" : "RSS feed"}</a>
        <a href={`${SITE_URL}/llms.txt`}>llms.txt</a>
      </nav>
      <p className="updated">
        {locale === "zh" ? "更新日期" : "Updated"}: {updatedAt}
      </p>
    </footer>
  );
}
