import { useState } from "react";
import { api } from "../lib/api";
import { formatCPF, isValidCPF } from "../lib/cpf";

export default function VirtualCardForm({ profile, onSaved, onCancel }) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [cpf, setCpf] = useState(profile.cpf ? formatCPF(profile.cpf) : "");
  const [birthDate, setBirthDate] = useState(profile.birth_date || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidCPF(cpf)) {
      setError("CPF inválido. Confira os números digitados.");
      return;
    }

    setLoading(true);
    try {
      const updated = await api.saveProfile({
        full_name: fullName,
        email: profile.email,
        cpf: cpf.replace(/\D/g, ""),
        birth_date: birthDate,
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message || "Não foi possível gerar o cartão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
      <h2 className="font-medium text-slate-700 mb-1">Gerar cartão Vale Mais virtual</h2>
      <p className="text-sm text-slate-500 mb-4">
        Esses dados aparecem no seu cartão de desconto, para apresentar nos estabelecimentos
        parceiros.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Nome completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        <input
          required
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          inputMode="numeric"
          maxLength={14}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        <div>
          <label className="block text-xs text-slate-500 mb-1">Data de nascimento</label>
          <input
            required
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-brand-green text-white font-semibold py-2.5 hover:bg-brand-greenLight transition disabled:opacity-60"
          >
            {loading ? "Gerando..." : "Gerar cartão"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-slate-300 text-slate-600 font-semibold px-4 py-2.5 hover:bg-slate-50 transition disabled:opacity-60"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
