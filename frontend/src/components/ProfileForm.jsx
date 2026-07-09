import { useState } from "react";
import { api } from "../lib/api";

function formFromProfile(profile) {
  return {
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    age: profile?.age != null ? String(profile.age) : "",
    sex: profile?.sex || "",
    neighborhood: profile?.neighborhood || "",
    city: profile?.city || "São José",
    street: profile?.street || "",
  };
}

export default function ProfileForm({ email, initialData, onSaved, onCancel }) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState(() => formFromProfile(initialData));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await api.saveProfile({
        full_name: form.fullName,
        email,
        phone: form.phone || null,
        age: form.age ? Number(form.age) : null,
        sex: form.sex || null,
        neighborhood: form.neighborhood || null,
        city: form.city || null,
        street: form.street || null,
      });
      onSaved(profile);
    } catch (err) {
      setError(err.message || "Não foi possível salvar seu cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
      <h2 className="font-medium text-slate-700 mb-1">
        {isEditing ? "Editar cadastro" : "Complete seu cadastro"}
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        {isEditing
          ? "Atualize seus dados, incluindo o endereço."
          : "Precisamos desses dados antes de liberar a assinatura."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Nome completo"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <input
            type="number"
            min="0"
            max="120"
            placeholder="Idade"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        <select
          value={form.sex}
          onChange={(e) => update("sex", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        >
          <option value="">Sexo</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="outro">Outro</option>
          <option value="prefiro_nao_dizer">Prefiro não dizer</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Bairro"
            value={form.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <input
            placeholder="Cidade"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        <input
          placeholder="Rua"
          value={form.street}
          onChange={(e) => update("street", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-brand-green text-white font-semibold py-2.5 hover:bg-brand-greenLight transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar cadastro"}
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
