import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { translateAuthError } from "../lib/authErrors";
import { supabase } from "../lib/supabaseClient";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  sex: "",
  neighborhood: "",
  city: "São José",
  street: "",
};

export default function Cadastro() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form"); // form | confirm-email | redirecting
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (signUpError) throw signUpError;

      if (!data.session) {
        setStep("confirm-email");
        setLoading(false);
        return;
      }

      await api.saveProfile({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        age: form.age ? Number(form.age) : null,
        sex: form.sex || null,
        neighborhood: form.neighborhood || null,
        city: form.city || null,
        street: form.street || null,
      });

      setStep("redirecting");
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      setError(translateAuthError(err.message));
      setLoading(false);
    }
  }

  if (step === "confirm-email") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-navy mb-4">Confirme seu e-mail</h1>
        <p className="text-slate-600">
          Enviamos um link de confirmação para <strong>{form.email}</strong>. Depois de
          confirmar, faça{" "}
          <Link to="/login" className="text-brand-green font-medium">
            login
          </Link>{" "}
          para continuar e finalizar a assinatura.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-navy mb-2">Assine o Vale Mais São José</h1>
      <p className="text-slate-500 mb-6">R$ 29,99/mês — cancele quando quiser.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-4">
          <legend className="font-semibold text-slate-700 mb-1">Acesso</legend>
          <input
            type="email"
            required
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha (mínimo 6 caracteres)"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </fieldset>

        <fieldset className="space-y-4 pt-2">
          <legend className="font-semibold text-slate-700 mb-1">Dados do assinante</legend>
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
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-green text-white font-semibold py-2.5 hover:bg-brand-greenLight transition disabled:opacity-60"
        >
          {loading ? "Processando..." : "Continuar para pagamento"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4">
        Já é assinante?{" "}
        <Link to="/login" className="text-brand-green font-medium">
          Entrar
        </Link>
      </p>
    </div>
  );
}
