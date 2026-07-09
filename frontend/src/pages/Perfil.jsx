import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const STATUS_LABEL = {
  active: { text: "Ativo", className: "bg-green-100 text-green-700" },
  inactive: { text: "Inativo", className: "bg-slate-200 text-slate-600" },
  past_due: { text: "Pagamento pendente", className: "bg-amber-100 text-amber-700" },
  canceled: { text: "Cancelado", className: "bg-red-100 text-red-700" },
};

export default function Perfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const checkoutFlag = searchParams.get("checkout");

  useEffect(() => {
    Promise.all([api.getProfile().catch(() => null), api.getSubscription()])
      .then(([profileData, subscriptionData]) => {
        setProfile(profileData);
        setSubscription(subscriptionData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubscribe() {
    setActionLoading(true);
    try {
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setActionLoading(false);
    }
  }

  async function handleManage() {
    setActionLoading(true);
    try {
      const { url } = await api.createBillingPortal();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-center py-16 text-slate-500">Carregando...</p>;

  const statusInfo = STATUS_LABEL[subscription?.status] || STATUS_LABEL.inactive;
  const isActive = subscription?.status === "active";

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Meu perfil</h1>

      {checkoutFlag === "sucesso" && (
        <p className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">
          Pagamento confirmado! Pode levar alguns segundos para o status ficar ativo.
        </p>
      )}
      {checkoutFlag === "cancelado" && (
        <p className="mb-4 rounded-lg bg-amber-50 text-amber-700 px-4 py-3 text-sm">
          Pagamento não concluído.
        </p>
      )}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-slate-700">Status da assinatura</span>
          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        </div>
        {profile ? (
          <button
            onClick={isActive ? handleManage : handleSubscribe}
            disabled={actionLoading}
            className="w-full rounded-lg bg-brand-green text-white font-semibold py-2.5 hover:bg-brand-greenLight transition disabled:opacity-60"
          >
            {actionLoading
              ? "Aguarde..."
              : isActive
                ? "Gerenciar assinatura"
                : "Assinar agora — R$ 29,99/mês"}
          </button>
        ) : (
          <p className="text-sm text-slate-500">Complete seu cadastro abaixo para poder assinar.</p>
        )}
      </div>

      {!profile && <ProfileForm email={user?.email} onSaved={setProfile} />}

      {profile && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 text-sm">
          <h2 className="font-medium text-slate-700 mb-2">Dados cadastrais</h2>
          <p>
            <span className="text-slate-400">Nome:</span> {profile.full_name}
          </p>
          <p>
            <span className="text-slate-400">E-mail:</span> {profile.email}
          </p>
          {profile.phone && (
            <p>
              <span className="text-slate-400">Telefone:</span> {profile.phone}
            </p>
          )}
          {profile.age && (
            <p>
              <span className="text-slate-400">Idade:</span> {profile.age}
            </p>
          )}
          {(profile.street || profile.neighborhood || profile.city) && (
            <p>
              <span className="text-slate-400">Endereço:</span>{" "}
              {[profile.street, profile.neighborhood, profile.city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
