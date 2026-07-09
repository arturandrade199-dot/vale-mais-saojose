import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-10 shadow">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Logo className="h-8 w-8" />
          Vale Mais São José
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/painel" className="hover:text-brand-greenLight">
                Parceiros
              </Link>
              <Link to="/perfil" className="hover:text-brand-greenLight">
                Meu perfil
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded bg-brand-green px-3 py-1.5 hover:bg-brand-greenLight transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-greenLight">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded bg-brand-green px-3 py-1.5 hover:bg-brand-greenLight transition"
              >
                Assinar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
