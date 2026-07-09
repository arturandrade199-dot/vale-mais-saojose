export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1.5 rounded-full text-sm border transition ${
          selected === ""
            ? "bg-brand-green text-white border-brand-green"
            : "bg-white text-slate-600 border-slate-300 hover:border-brand-green"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            selected === cat.slug
              ? "bg-brand-green text-white border-brand-green"
              : "bg-white text-slate-600 border-slate-300 hover:border-brand-green"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
