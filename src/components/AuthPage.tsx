import { useState } from "react";
import { Target } from "lucide-react";

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export default function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
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
        setInfo("注册成功！如果开启了邮箱验证，请去邮箱点确认链接后再登录。");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "出错了，请重试";
      setError(translateError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100">
            <Target size={18} className="text-teal-800" />
          </span>
          <h1 className="text-xl font-medium text-neutral-900">Goal Quest</h1>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex mb-6 rounded-lg bg-neutral-100 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 text-sm font-medium rounded-md py-1.5 transition-colors ${
                mode === "signin" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 text-sm font-medium rounded-md py-1.5 transition-colors ${
                mode === "signup" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">邮箱</label>
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">密码</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6位"
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
              {loading ? "处理中..." : mode === "signin" ? "登录" : "注册"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function translateError(message: string): string {
  if (message.includes("Invalid login credentials")) return "邮箱或密码不正确";
  if (message.includes("User already registered")) return "这个邮箱已经注册过了，试试直接登录";
  if (message.includes("Password should be at least")) return "密码至少需要6位";
  if (message.includes("Unable to validate email address")) return "邮箱格式不正确";
  return message;
}
