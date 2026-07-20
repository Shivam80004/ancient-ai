import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Premium glass surface per specs/06 — near-black dark, hairline border,
 * soft layered depth + 1px top inner highlight, ember glow on hover.
 */
export function GlassCard({
    className,
    children,
    bg_grad,
    hover = false,
}: {
    className?: string;
    children: ReactNode;
    hover?: boolean;
    bg_grad?: string;
}) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.5)]",
                hover &&
                "transition hover:border-white/[0.14] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(241,89,6,0.12)]",
                className
            )}

            style={{ background: bg_grad ? bg_grad : undefined }}
        >
            {children}
        </div>
    );
}
