import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Landing() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <Logo className="h-20 w-20 mx-auto mb-6" />
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
        Vale Mais São José
      </h1>
      <p className="text-brand-green font-semibold mt-1">
        Mais benefícios, mais economia, mais para você.
      </p>
      <p className="text-slate-600 mt-6 leading-relaxed">
        Assine por <strong>R$ 29,99/mês</strong> e tenha acesso a descontos em
        dezenas de empresas parceiras de São José: mercados, farmácias,
        postos, restaurantes, salões de beleza, clínicas, academias e muito
        mais.
      </p>
      <Link
        to="/cadastro"
        className="inline-block mt-8 rounded-lg bg-brand-green text-white font-semibold px-6 py-3 hover:bg-brand-greenLight transition"
      >
        Quero assinar
      </Link>
    </div>
  );
}
