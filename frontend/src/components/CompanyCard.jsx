import { formatDiscount } from "../lib/format";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function CompanyCard({ company, isFavorite, onToggleFavorite }) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-4 items-start hover:shadow-md transition">
      <button
        type="button"
        onClick={() => onToggleFavorite(company.id)}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorite}
        className={`absolute top-3 right-3 text-xl leading-none transition ${
          isFavorite ? "text-red-500" : "text-slate-300 hover:text-red-300"
        }`}
      >
        {isFavorite ? "♥" : "♡"}
      </button>
      {company.logo_url ? (
        <img
          src={company.logo_url}
          alt={company.name}
          className="h-14 w-14 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-14 w-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold flex-shrink-0">
          {initials(company.name)}
        </div>
      )}
      <div className="min-w-0 pr-6">
        <h3 className="font-semibold text-slate-900 truncate">{company.name}</h3>
        <span className="inline-block text-xs font-medium text-brand-green bg-green-50 rounded-full px-2 py-0.5 mt-1">
          {company.category_name}
        </span>
        <p className="text-sm text-slate-600 mt-2">{formatDiscount(company)}</p>
        {company.neighborhood && (
          <p className="text-xs text-slate-400 mt-1">{company.neighborhood}</p>
        )}
      </div>
    </div>
  );
}
