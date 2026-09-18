"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";

export default function RootPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(user ? "/dashboard" : "/login");
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Icon icon="lucide:loader-2" className="size-6 animate-spin text-primary" />
    </div>
  );
}
