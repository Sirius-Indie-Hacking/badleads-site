// The one place to edit before launch. Empty links render as plain text, never a dead link.
export const SITE_URL = "https://badleads.xyz";

// Store links. Empty App Store URL = the page says "For iPhone and iPad" (Android shows nothing).
// To go live, set APP_STORE_URL to the App Store link.
export const APP_STORE_URL = "";
export const GOOGLE_PLAY_URL = "";

// ONE switch for the podcast. false = no podcast page, feed, nav link, home section or sitemap entry
// (and dist/podcast is removed after the build). The podcast files stay in the repo.
export const PODCAST_ENABLED = false;

// Podcast directories. A button appears only when its link is set.
export const PODCAST_LINKS = {
  spotify: "",
  apple: "",
  youtube: "",
  amazon: "",
};

// Live: Cloudflare Email Routing forwards contact@badleads.xyz to the owner's verified Gmail (checked 2026-11-18).
export const CONTACT_EMAIL = "contact@badleads.xyz";

export const PODCAST_AUTHOR = "Bad Leads";

// Languages that have pages. Add "es", "fr", "de", "nl", "ko", "ja", "tr" here once
// src/pages/<lang>/ exists; hreflang tags then appear on their own.
export const LOCALES = ["en"];
export const DEFAULT_LOCALE = "en";
