import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompanyCard from "../components/CompanyCard";
import FiltersBar from "../components/FiltersBar";
import SearchBar from "../components/SearchBar";
import { api } from "../lib/api";
import {
  getFavorites,
  getShowOnlyFavorites,
  saveFavorites,
  saveShowOnlyFavorites,
} from "../lib/favorites";

export default function Painel() {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inactive, setInactive] = useState(false);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(() => getShowOnlyFavorites());

  function toggleFavorite(companyId) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      saveFavorites(next);
      return next;
    });
  }

  function toggleShowOnlyFavorites() {
    setShowOnlyFavorites((prev) => {
      const next = !prev;
      saveShowOnlyFavorites(next);
      return next;
    });
  }

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const timeout = setTimeout(() => {
      api
        .getCompanies({ category: selectedCategory, search })
        .then((data) => {
          setCompanies(data);
          setInactive(false);
        })
        .catch((err) => {
          if (err.message?.toLowerCase().includes("assinatura inativa")) {
            setInactive(true);
          } else {
            setError(err.message || "Erro ao carregar empresas parceiras.");
          }
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedCategory, search]);

  const visibleCompanies = useMemo(() => {
    if (!showOnlyFavorites) return companies;
    return companies.filter((company) => favorites.has(company.id));
  }, [companies, favorites, showOnlyFavorites]);

  const emptyMessage = useMemo(() => {
    if (showOnlyFavorites) return "Você ainda não favoritou nenhum parceiro.";
    if (search || selectedCategory) return "Nenhuma empresa encontrada com esse filtro.";
    return "Nenhuma empresa parceira cadastrada ainda.";
  }, [search, selectedCategory, showOnlyFavorites]);

  if (inactive) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-navy mb-3">Assinatura inativa</h1>
        <p className="text-slate-600 mb-6">
          Sua assinatura ainda não está ativa. Finalize o pagamento para liberar o acesso
          aos descontos dos parceiros.
        </p>
        <Link
          to="/perfil"
          className="inline-block rounded-lg bg-brand-green text-white font-semibold px-6 py-3 hover:bg-brand-greenLight transition"
        >
          Ver status da assinatura
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-navy mb-1">Empresas Parceiras</h1>
      <p className="text-slate-500 mb-6">Aproveite os descontos exclusivos para assinantes.</p>

      <div className="space-y-3 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <FiltersBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showOnlyFavorites={showOnlyFavorites}
          onToggleFavorites={toggleShowOnlyFavorites}
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-slate-500">Carregando...</p>}

      {!loading && !error && visibleCompanies.length === 0 && (
        <p className="text-slate-500">{emptyMessage}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isFavorite={favorites.has(company.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
