"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Protection({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow public access to auth routes
  // ✅ Tambahkan halaman publik di sini
  const isPublic =
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname === "/home";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublic) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, isPublic, router]);

  if (!isPublic && (loading || !isAuthenticated)) return null;

  return <>{children}</>;
}