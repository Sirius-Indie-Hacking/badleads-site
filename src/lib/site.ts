import { en, type Copy } from "../i18n/en";
import * as cfg from "../../site.config.mjs";

export const SITE_URL: string = cfg.SITE_URL.replace(/\/$/, "");
export const APP_STORE_URL: string = cfg.APP_STORE_URL;
export const GOOGLE_PLAY_URL: string = cfg.GOOGLE_PLAY_URL;
export const PODCAST_ENABLED: boolean = cfg.PODCAST_ENABLED;
export const PODCAST_LINKS: Record<string, string> = cfg.PODCAST_LINKS;
export const CONTACT_EMAIL: string = cfg.CONTACT_EMAIL;
export const PODCAST_AUTHOR: string = cfg.PODCAST_AUTHOR;
export const LOCALES: string[] = cfg.LOCALES;
export const DEFAULT_LOCALE: string = cfg.DEFAULT_LOCALE;

// More languages: add src/i18n/<lang>.ts with the same shape as en.ts and register it here.
const dictionaries: Record<string, Copy> = { en };
export function getCopy(lang: string): Copy {
  return dictionaries[lang] ?? en;
}

// "/podcast/" for English, "/es/podcast/" for Spanish.
export function localePath(lang: string, path: string): string {
  return lang === DEFAULT_LOCALE ? path : `/${lang}${path}`;
}

export function abs(path: string): string {
  return `${SITE_URL}${path}`;
}

// hreflang alternates for a page, only for languages that really have pages.
export function alternates(path: string): { hreflang: string; href: string }[] {
  const list = LOCALES.map((l) => ({ hreflang: l, href: abs(localePath(l, path)) }));
  list.push({ hreflang: "x-default", href: abs(localePath(DEFAULT_LOCALE, path)) });
  return list;
}

export const podcastPlatforms = (): { key: string; url: string }[] =>
  Object.entries(PODCAST_LINKS)
    .filter(([, url]) => !!url)
    .map(([key, url]) => ({ key, url }));
