import { useEffect } from "react";

interface PageSeoOptions {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

const setCanonical = (href: string) => {
  let tag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const setMetaByName = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setMetaByProperty = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export const usePageSeo = ({
  title,
  description,
  keywords,
  robots,
  canonicalPath,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
}: PageSeoOptions) => {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = `${window.location.origin}${canonicalPath || window.location.pathname}`;

    setMetaByName("description", description);
    setMetaByProperty("og:title", ogTitle || title);
    setMetaByProperty("og:description", ogDescription || description);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByName("twitter:title", twitterTitle || title);
    setMetaByName("twitter:description", twitterDescription || description);
    setCanonical(canonicalUrl);

    if (keywords) {
      setMetaByName("keywords", keywords);
    }

    if (robots) {
      setMetaByName("robots", robots);
    }
  }, [
    title,
    description,
    keywords,
    robots,
    canonicalPath,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
  ]);
};
