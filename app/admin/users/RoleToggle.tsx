"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { setUserRole } from "./actions";
import { cn } from "@/lib/utils";

export function RoleToggle({ userId, role }: { userId: string; role: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    const makeAdmin = role !== "admin";

    return (
        <button
            onClick={() =>
                start(async () => {
                    await setUserRole(userId, makeAdmin ? "admin" : "user");
                    router.refresh();
                })
            }
            disabled={pending}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50",
                makeAdmin
                    ? "border-[#f15906]/30 bg-[#f15906]/10 text-[#f15906] hover:bg-[#f15906]/20"
                    : "border-white/15 bg-white/[0.06] text-white/70 hover:bg-white/[0.12]"
            )}
        >
            {pending ? (
                <Loader2 className="size-3.5 animate-spin" />
            ) : makeAdmin ? (
                <ShieldCheck className="size-3.5" />
            ) : (
                <ShieldOff className="size-3.5" />
            )}
            {makeAdmin ? "Make admin" : "Make user"}
        </button>
    );
}
