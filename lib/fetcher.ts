const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};

export async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}/rest/v1/${endpoint}`, {
    headers,
    // For public GETs, allow caching by default to speed up page loads.
    // For truly dynamic data, pass cache: "no-store" via fetchAPIOptions wrapper.
    cache: "force-cache",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("API ERROR:", {
      endpoint,
      status: res.status,
      statusText: res.statusText,
      data,
    });
    const message =
      (data && (data.message || data.error_description || data.hint)) ||
      `API error (${res.status})`;
    throw new Error(message);
  }

  return data;
}

type FetchAPIOptions = {
  cache?: RequestCache;
  // Next.js supports `next.revalidate` in server runtime; harmless in browser.
  revalidate?: number;
};

export async function fetchAPIWithOptions(endpoint: string, options?: FetchAPIOptions) {
  const isServer = typeof window === "undefined";

  const res = await fetch(`${BASE_URL}/rest/v1/${endpoint}`, {
    headers,
    cache: options?.cache ?? "force-cache",
    ...(isServer && options?.revalidate != null ? { next: { revalidate: options.revalidate } } : null),
  } as RequestInit);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("API ERROR:", {
      endpoint,
      status: res.status,
      statusText: res.statusText,
      data,
    });
    const message =
      (data && (data.message || data.error_description || data.hint)) ||
      `API error (${res.status})`;
    throw new Error(message);
  }

  return data;
}