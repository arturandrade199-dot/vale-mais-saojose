import { useState } from "react";

function Pill({ active, activeClass = "bg-brand-green text-white border-brand-green", className = "", children, ...props }) {
  return (
    <button
      type="button"
      className={`px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap ${
        active ? activeClass : "bg-white text-slate-600 border-slate-300 hover:border-brand-green"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function FiltersBar({
  categories,
  selectedCategory,
  onSelectCategory,
  showOnlyFavorites,
  onToggleFavorites,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const favoriteActiveClass = "bg-red-500 text-white border-red-500";

  return (
    <div>
      {/* Mobile: barra compacta com Todos, Favoritos e um botão para expandir os ramos */}
      <div className="flex items-center gap-2 sm:hidden">
        <Pill active={selectedCategory === ""} onClick={() => onSelectCategory("")}>
          Todos
        </Pill>
        <Pill active={showOnlyFavorites} activeClass={favoriteActiveClass} onClick={onToggleFavorites}>
          ♥ Favoritos
        </Pill>
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          aria-expanded={filtersOpen}
          className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition ${
            selectedCategory
              ? "bg-brand-navy text-white border-brand-navy"
              : "bg-white text-slate-600 border-slate-300"
          }`}
        >
          Filtros {filtersOpen ? "▲" : "▼"}
        </button>
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap gap-2 mt-2 sm:hidden">
          {categories.map((cat) => (
            <Pill
              key={cat.id}
              active={selectedCategory === cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                setFiltersOpen(false);
              }}
            >
              {cat.name}
            </Pill>
          ))}
        </div>
      )}

      {/* Desktop: tudo visível de uma vez */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <Pill active={selectedCategory === ""} onClick={() => onSelectCategory("")}>
          Todos
        </Pill>
        {categories.map((cat) => (
          <Pill
            key={cat.id}
            active={selectedCategory === cat.slug}
            onClick={() => onSelectCategory(cat.slug)}
          >
            {cat.name}
          </Pill>
        ))}
        <Pill active={showOnlyFavorites} activeClass={favoriteActiveClass} onClick={onToggleFavorites}>
          ♥ Favoritos
        </Pill>
      </div>
    </div>
  );
}
