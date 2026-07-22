"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearSession,
  isAuthenticated,
  resolveDevFirebaseUid,
  setSession,
} from "@/lib/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@vela.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      clearSession();
      const firebase_uid = resolveDevFirebaseUid(email);
      // Password is accepted in UI for UX; MVP auth is UID-based until staff auth is real
      void password;
      const user = await api.login(email.trim(), firebase_uid);
      setSession(firebase_uid, user);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión. Comprueba el backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-48 relative mb-4">
            <Image
              src="/logo.svg"
              alt="Vela Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            Ingresa tus credenciales para acceder al panel de administración.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vela.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                MVP: usa admin@vela.com (UID de desarrollo). La contraseña aún no se
                valida en el backend.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Vela Health. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
