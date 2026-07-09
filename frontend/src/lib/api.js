import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;

async function request(path, { method = "GET", body } = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getCategories: () => request("/api/categories"),
  getCompanies: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/api/companies${query ? `?${query}` : ""}`);
  },
  getProfile: () => request("/api/profile"),
  saveProfile: (payload) => request("/api/profile", { method: "POST", body: payload }),
  getSubscription: () => request("/api/profile/subscription"),
  createCheckoutSession: () => request("/api/checkout-session", { method: "POST" }),
  createBillingPortal: () => request("/api/billing-portal", { method: "POST" }),
};
