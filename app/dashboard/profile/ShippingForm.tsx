"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { updateShippingAction, type ShippingInfo } from "./actions";

const FIELDS: { key: keyof ShippingInfo; label: string; span?: boolean }[] = [
    { key: "name", label: "Full name", span: true },
    { key: "line1", label: "Address", span: true },
    { key: "city", label: "City" },
    { key: "postal", label: "Postal code" },
    { key: "country", label: "Country", span: true },
];

export function ShippingForm({ initial }: { initial: ShippingInfo }) {
    const [form, setForm] = useState<ShippingInfo>(initial ?? {});
    const [saved, setSaved] = useState(false);
    const [pending, start] = useTransition();

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaved(false);
        start(async () => {
            const res = await updateShippingAction(form);
            if (!res.error) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            }
        });
    }

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
                <label key={f.key} className={f.span ? "sm:col-span-2" : ""}>
                    <span className="mb-1.5 block text-xs font-medium text-white/50">{f.label}</span>
                    <input
                        value={form[f.key] ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-[#0f0c0b] px-4 py-2.5 text-sm text-white placeholder-white/30 shadow-inner shadow-black/40 transition focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30"
                    />
                </label>
            ))}
            <div className="flex items-center gap-3 sm:col-span-2">
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-60"
                >
                    {pending ? "Saving…" : "Save address"}
                </button>
                {saved && (
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-300">
                        <Check className="size-4" /> Saved
                    </span>
                )}
            </div>
        </form>
    );
}
