import Logo from "./Logo";
import { generateCardPdf } from "../lib/cardPdf";
import { formatCPF } from "../lib/cpf";

function formatBirthDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function memberNumber(userId) {
  return userId ? userId.replace(/-/g, "").slice(0, 8).toUpperCase() : "—";
}

export default function VirtualCard({ profile, userId, isActive, onEdit }) {
  return (
    <div className="mb-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-navy to-slate-900 text-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold leading-tight">Vale Mais São José</span>
          </div>
          <span
            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
              isActive ? "bg-brand-greenLight text-brand-navy" : "bg-slate-500 text-white"
            }`}
          >
            {isActive ? "ATIVO" : "INATIVO"}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 uppercase tracking-wide">Titular</p>
        <p className="font-semibold text-lg mb-4 truncate">{profile.full_name}</p>

        <div className="flex justify-between items-end gap-3">
          <div>
            <p className="text-[11px] text-slate-300 uppercase tracking-wide">CPF</p>
            <p className="font-mono text-sm">{formatCPF(profile.cpf)}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-300 uppercase tracking-wide">Nascimento</p>
            <p className="font-mono text-sm">{formatBirthDate(profile.birth_date)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-300 uppercase tracking-wide">Nº</p>
            <p className="font-mono text-sm">{memberNumber(userId)}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <button
          type="button"
          onClick={() => generateCardPdf(profile, userId, isActive)}
          className="text-xs font-semibold text-brand-navy hover:text-brand-green"
        >
          Baixar PDF
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-brand-green hover:text-brand-greenLight"
        >
          Editar dados do cartão
        </button>
      </div>
    </div>
  );
}
