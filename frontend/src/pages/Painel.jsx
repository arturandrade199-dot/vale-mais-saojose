import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import CompanyCard from "../components/CompanyCard";
import SearchBar from "../components/SearchBar";
import { api } from "../lib/api";

export default function Painel() {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inactive, setInactive] = useState(false);

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

  const emptyMessage = useMemo(() => {
    if (search || selectedCategory) return "Nenhuma empresa encontrada com esse filtro.";
    return "Nenhuma empresa parceira cadastrada ainda.";
  }, [search, selectedCategory]);

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

      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-slate-500">Carregando...</p>}

      {!loading && !error && companies.length === 0 && (
        <p className="text-slate-500">{emptyMessage}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
