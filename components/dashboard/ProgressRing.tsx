"use client";

import { useEffect, useState, type ReactNode } from "react";
import { animate } from "framer-motion";

export function ProgressRing({
    value,
    size = 120,
    stroke = 10,
    children,
}: {
    value: number;
    size?: number;
    stroke?: number;
    children?: ReactNode;
}) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const controls = animate(0, Math.max(0, Math.min(100, value)), {
            duration: reduce ? 0 : 1,
            ease: "easeOut",
            onUpdate: setPct,
        });
        return () => controls.stop();
    }, [value]);

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="url(#ring-ember)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c - (pct / 100) * c}
                />
                <defs>
                    <linearGradient id="ring-ember" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff8c00" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        </div>
    );
}
