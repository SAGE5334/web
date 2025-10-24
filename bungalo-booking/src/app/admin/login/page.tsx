"use client";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const data = await res.json();
      setError(data.error || "Giriş başarısız");
    }
  };

  return (
    <main className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Giriş</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border rounded p-2 w-full"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded p-2 w-full"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="bg-black text-white rounded px-4 py-2 w-full" type="submit">
          Giriş Yap
        </button>
      </form>
    </main>
  );
}
