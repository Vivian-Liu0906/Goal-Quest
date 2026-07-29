import { useState } from "react";
import { Target } from "lucide-react";
import { useLanguage } from "../i18n";
import type { TranslationKey } from "../i18n";
import LanguageSwitch from "./LanguageSwitch";

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export default function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
        setInfo(t("auth.signUpSuccess"));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      setError(translateError(message, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100">
            <Target size={18} className="text-teal-800" />
          </span>
          <h1 className="text-xl font-medium text-neutral-900">{t("app.title")}</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex mb-6 rounded-lg bg-neutral-100 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 text-sm font-medium rounded-md py-1.5 transition-colors ${
                mode === "signin" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 text-sm font-medium rounded-md py-1.5 transition-colors ${
                mode === "signup" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t("auth.email")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t("auth.password")}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordHint")}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {info && <p className="text-sm text-teal-700">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neutral-900 text-white text-sm font-medium py-2.5 hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? t("auth.processing") : mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function translateError(message: string, t: (key: TranslationKey) => string): string {
  if (message.includes("Invalid login credentials")) return t("auth.error.invalidCreds");
  if (message.includes("User already registered")) return t("auth.error.alreadyRegistered");
  if (message.includes("Password should be at least")) return t("auth.error.weakPassword");
  if (message.includes("Unable to validate email address")) return t("auth.error.invalidEmail");
  return t("auth.error.generic");
}
