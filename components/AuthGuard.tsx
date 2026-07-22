"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  return <>{children}</>;
}
