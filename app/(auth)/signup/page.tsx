"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/todos");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-black text-white rounded p-2 disabled:opacity-50">
          {loading ? "..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <a href="/login" className="underline">Log in</a>
      </p>
    </main>
  );
}
