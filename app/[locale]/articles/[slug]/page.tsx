import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { JsonLd } from "../../../components/JsonLd";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import {
  articlePath,
  articles,
  getArticle,
  getReadyImage,
  type Article,
  type ArticleBlock,
} from "../../../lib/articles";
import { formatEditorialDate } from "../../../lib/content-dates";
import { buildMetadata } from "../../../lib/metadata";
import { absolutePath, isLocale, localPath, locales, SITE_URL, type Locale } from "../../../lib/site";
import {
  AUTHOR_SCHEMA,
  PUBLISHER_SCHEMA,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildMenciusPersonSchema,
} from "../../../lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function getLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

function getArticleOrNotFound(slug: string): Article {
  const article = getArticle(slug);
  if (!article) notFound();
  return article;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const article = getArticleOrNotFound(slug);
  const content = article[locale];
  const path = articlePath(article.slug);
  const hero = getReadyImage(article, article.heroImage);

  return buildMetadata({
    locale,
    path,
    title: content.title,
    description: content.description,
    type: "article",
    absoluteTitle: locale === "en",
    socialImagePath: hero ? hero.src! : `/${locale}${path}/opengraph-image`,
    socialImageAlt: hero ? hero.alt[locale] : content.title,
    socialImageWidth: hero ? hero.width! : 1200,
    socialImageHeight: hero ? hero.height! : 630,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

function ArticleFigure({ article, locale, imageKey, priority = false }: { article: Article; locale: Locale; imageKey: string; priority?: boolean }) {
  const image = getReadyImage(article, imageKey);
  if (!image) return null;

  return (
    <figure className="article-figure">
      <Image
        src={image.src!}
        alt={image.alt[locale]}
        width={image.width!}
        height={image.height!}
        priority={priority}
        sizes="(max-width: 860px) 100vw, 980px"
      />
      {image.caption?.[locale] ? <figcaption>{image.caption[locale]}</figcaption> : null}
    </figure>
  );
}

function renderBlock(block: ArticleBlock, index: number, article: Article, locale: Locale) {
  switch (block.type) {
    case "heading":
      return <h2 key={index}>{block.text}</h2>;
    case "paragraph":
      return <p key={index}>{block.text}</p>;
    case "quote":
      return (
        <blockquote key={index} className="article-quote">
          <p>{block.text}</p>
          {block.cite ? (
            <cite>
              {block.href ? (
                <a className="text-link" href={localPath(locale, block.href)}>
                  {block.cite}
                </a>
              ) : (
                block.cite
              )}
            </cite>
          ) : null}
        </blockquote>
      );
    case "list":
      return block.ordered ? (
        <ol key={index} className="article-list">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ol>
      ) : (
        <ul key={index} className="article-list">
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case "callout":
      return (
        <section key={index} className="definition-box">
          <h2>{block.title}</h2>
          <p>{block.text}</p>
        </section>
      );
    case "image":
      return <ArticleFigure key={index} article={article} locale={locale} imageKey={block.image} priority={block.image === article.heroImage} />;
    default:
      return null;
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocale(localeParam);
  const article = getArticleOrNotFound(slug);
  const content = article[locale];
  const path = articlePath(article.slug);
  const hero = getReadyImage(article, article.heroImage);
  const readyImages = Object.keys(article.images)
    .map((key) => getReadyImage(article, key))
    .filter((image): image is NonNullable<typeof image> => Boolean(image));
  const breadcrumbItems = [
    { label: locale === "zh" ? "首页" : "Home", href: "" },
    { label: locale === "zh" ? "专栏" : "Articles", href: "/articles" },
    { label: content.title, href: path },
  ];
  const wordCount = content.blocks
    .map((block) => ("text" in block ? block.text : "items" in block ? block.items.join(" ") : ""))
    .join(" ")
    .trim()
    .split(/\s+/u).length;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: content.title,
      alternativeHeadline: content.h1,
      description: content.description,
      url: absolutePath(locale, path),
      mainEntityOfPage: absolutePath(locale, path),
      image: readyImages.length
        ? readyImages.map((image) => `${SITE_URL}${image.src}`)
        : [absolutePath(locale, `${path}/opengraph-image`)],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: AUTHOR_SCHEMA,
      publisher: PUBLISHER_SCHEMA,
      isAccessibleForFree: true,
      inLanguage: locale === "zh" ? "zh-CN" : "en",
      keywords: article.keywords.join(", "),
      wordCount: locale === "zh" ? undefined : wordCount,
      about: [
        buildMenciusPersonSchema(locale),
        ...article.targetQueries[locale].map((keyword) => ({ "@type": "Thing", name: keyword })),
      ],
      citation: article.sourceRefs,
      isPartOf: { "@type": "CollectionPage", name: locale === "zh" ? "孟子专栏" : "Mencius articles", url: absolutePath(locale, "/articles") },
    },
    buildBreadcrumbJsonLd(locale, breadcrumbItems),
    buildFaqPageJsonLd(absolutePath(locale, path), content.title, content.faq),
  ];

  return (
    <main className="site-shell article-shell">
      <JsonLd data={jsonLd} />
      <SiteHeader locale={locale} active="article" path={path} />
      <Breadcrumbs locale={locale} items={breadcrumbItems} />

      <article className="article-page">
        <header className="page-hero article-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.h1}</h1>
          <p>{content.lead}</p>
          <p className="article-meta">
            {locale === "zh" ? "发布" : "Published"} {formatEditorialDate(article.publishedAt)}
            {" · "}
            {locale === "zh" ? "更新" : "Updated"} {formatEditorialDate(article.updatedAt)}
            {" · "}
            {article.sourceRefs.join(locale === "zh" ? "、" : ", ")}
          </p>
        </header>

        <section className="section-block article-takeaways">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "先看结论" : "Key takeaways"}</p>
            <h2>{locale === "zh" ? "读完这篇你应该记住的四件事" : "What to remember from this article"}</h2>
          </div>
          <ul className="article-list">
            {content.keyTakeaways.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <div className="article-body">
          {content.blocks.map((block, index) => renderBlock(block, index, article, locale))}
        </div>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "这页承接的搜索问题" : "Search questions this page answers"}</p>
            <h2>{locale === "zh" ? "如果你是带着这些问题来的，这页就是为你写的" : "If you arrived with one of these questions, this page was written for you"}</h2>
          </div>
          <div className="principle-grid page-grid">
            {article.targetQueries[locale].map((term) => (
              <div className="small-card" key={term}>{term}</div>
            ))}
          </div>
        </section>

        <section className="answer-section">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "常见问题" : "Common questions"}</p>
            <h2>{locale === "zh" ? "适合搜索与 AI 引用的回答" : "Answers built for precise citation"}</h2>
          </div>
          <div className="answer-list">
            {content.faq.map((item) => (
              <article key={item.question} className="answer-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="answer-section">
          <div className="section-heading">
            <p className="eyebrow">{locale === "zh" ? "回到原文与主题页" : "Back to the text and the hub pages"}</p>
            <h2>{locale === "zh" ? "继续读：原文出处与相关主题" : "Continue: source passages and related themes"}</h2>
          </div>
          <div className="answer-list">
            {content.relatedLinks.map((item) => (
              <article key={item.path} className="answer-item">
                <h3>
                  <a className="text-link" href={localPath(locale, item.path)}>
                    {item.label}
                  </a>
                </h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        {hero ? (
          <p className="article-credit">
            {locale === "zh"
              ? `插图由 ${hero.generatedBy ?? "Grok Imagine"} 根据本站编辑提示词生成，属于示意性艺术再现，不是历史图像。`
              : `Illustrations were generated with ${hero.generatedBy ?? "Grok Imagine"} from editorial prompts written for this site; they are interpretive art, not historical images.`}
          </p>
        ) : null}
      </article>

      <section className="next-section">
        <h2>{locale === "zh" ? "返回专栏索引" : "Back to the article index"}</h2>
        <a className="primary-action" href={localPath(locale, "/articles")}>
          {locale === "zh" ? "查看全部文章" : "View all articles"}
        </a>
      </section>

      <SiteFooter locale={locale} updatedAt={article.updatedAt} />
    </main>
  );
}
