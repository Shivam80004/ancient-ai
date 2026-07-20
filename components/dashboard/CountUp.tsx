"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

/** Animated count-up number (respects reduced motion by finishing fast). */
export function CountUp({
    value,
    className,
    format = (n) => n.toLocaleString(),
}: {
    value: number;
    className?: string;
    format?: (n: number) => string;
}) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const controls = animate(0, value, {
            duration: reduce ? 0 : 1,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [value]);

    return <span className={className}>{format(display)}</span>;
}
