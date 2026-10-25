export type Member = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type TokenPair = {
  access: string;
  refresh: string;
  user?: Member;
};

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const accessKey = "tshoe-access-token";
const refreshKey = "tshoe-refresh-token";
const memberKey = "tshoe-member";
let refreshPromise: Promise<string | null> | null = null;

function storage(remember = true): Storage {
  return remember ? localStorage : sessionStorage;
}

function clearAuth() {
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(accessKey);
    store.removeItem(refreshKey);
    store.removeItem(memberKey);
  }
}

async function responseData<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "The authentication request failed.";
    throw new Error(detail);
  }
  return data as T;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const stored = typeof window === "undefined" ? null : storedTokens();
  if (stored?.access && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${stored.access}`);
  const url = `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  let response = await fetch(url, { ...init, headers });
  if (response.status === 401 && stored && !path.includes("/auth/")) {
    const access = await refreshAccess();
    if (access) {
      headers.set("Authorization", `Bearer ${access}`);
      response = await fetch(url, { ...init, headers });
    }
  }
  return responseData<T>(response);
}

function saveTokens(tokens: TokenPair, remember: boolean) {
  clearAuth();
  const target = storage(remember);
  target.setItem(accessKey, tokens.access);
  target.setItem(refreshKey, tokens.refresh);
  if (tokens.user) target.setItem(memberKey, JSON.stringify(tokens.user));
}

function storedTokens() {
  for (const target of [localStorage, sessionStorage]) {
    const access = target.getItem(accessKey);
    const refresh = target.getItem(refreshKey);
    if (access || refresh) return { target, access, refresh };
  }
  return null;
}

async function refreshAccess(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = refreshAccessToken();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const stored = storedTokens();
  if (!stored?.refresh) return null;
  const response = await fetch(`${apiBase}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: stored.refresh }),
  });
  if (response.status === 400 || response.status === 401) {
    clearAuth();
    return null;
  }
  if (!response.ok) await responseData(response);
  const tokens = await responseData<{ access: string; refresh?: string }>(response);
  stored.target.setItem(accessKey, tokens.access);
  if (tokens.refresh) stored.target.setItem(refreshKey, tokens.refresh);
  return tokens.access;
}

async function authenticate(path: "login" | "register", body: Record<string, string>, remember: boolean) {
  let response: Response;
  try {
    response = await fetch(`${apiBase}/auth/${path}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot reach the T-SHOE API at ${apiBase}. Start Django from the backend folder, or set NEXT_PUBLIC_API_URL to your deployed backend API and allow this site in CORS.`,
      );
    }
    throw error;
  }
  const tokens = await responseData<TokenPair>(response);
  saveTokens(tokens, remember);
  return tokens.user;
}

export function loginMember(identifier: string, password: string, remember: boolean) {
  return authenticate("login", { identifier, password }, remember);
}

export function registerMember(name: string, phone: string, email: string, password: string, remember: boolean) {
  return authenticate("register", { name, phone, email, password }, remember);
}

export async function getCurrentMember(): Promise<Member | null> {
  let tokens = storedTokens();
  if (!tokens) return null;
  let access = tokens.access;
  if (!access) access = await refreshAccess();
  if (!access) return null;

  const request = (token: string) => fetch(`${apiBase}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let response = await request(access);
  if (response.status === 401) {
    access = await refreshAccess();
    if (!access) return null;
    response = await request(access);
  }
  const result = await responseData<{ user: Member }>(response);
  const currentStorage = storedTokens()?.target;
  currentStorage?.setItem(memberKey, JSON.stringify(result.user));
  return result.user;
}

export async function logoutMember(): Promise<void> {
  const stored = storedTokens();
  try {
    if (stored?.refresh) {
      const response = await fetch(`${apiBase}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: stored.refresh }),
      });
      if (!response.ok) await responseData(response);
    }
  } finally {
    clearAuth();
  }
}
