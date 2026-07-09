const FAVORITES_KEY = "vale-mais-favoritos";
const SHOW_ONLY_KEY = "vale-mais-mostrar-somente-favoritos";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

export function getShowOnlyFavorites() {
  return localStorage.getItem(SHOW_ONLY_KEY) === "true";
}

export function saveShowOnlyFavorites(value) {
  localStorage.setItem(SHOW_ONLY_KEY, String(value));
}
