"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Briefcase, Sparkles, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveOnboarding, skipOnboarding, type OnboardingData } from "./actions";

const OCCUPATIONS = [
    { value: "student", label: "Student", icon: GraduationCap, detailLabel: "Field of study" },
    { value: "working", label: "Working professional", icon: Briefcase, detailLabel: "Your role / job title" },
    { value: "other", label: "Something else", icon: Sparkles, detailLabel: "Tell us what you do" },
];
const DOMAINS = ["Technology", "Design", "Business", "Health & Wellness", "Arts & Creative", "Education", "Science", "Finance", "Marketing", "Other"];
const INTERESTS = ["Music", "Reading", "Photography", "Fitness", "Meditation", "Art & Design", "Travel", "Cooking", "Gaming", "Writing", "Nature", "Spirituality", "Film", "Sports", "Dance", "Technology"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const input = "w-full rounded-2xl border border-white/10 bg-[#0f0c0b] px-4 py-3 text-white placeholder-white/30 shadow-inner shadow-black/40 transition focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";
const TOTAL = 4;

export function OnboardingForm({ displayName, initial }: { displayName: string; initial: OnboardingData }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<OnboardingData>(initial);
    const [pending, start] = useTransition();
    const set = <K extends keyof OnboardingData>(k: K, v: OnboardingData[K]) => setForm((f) => ({ ...f, [k]: v }));

    function toggleInterest(i: string) {
        setForm((f) => ({
            ...f,
            interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i],
        }));
    }

    function finish() {
        start(async () => {
            await saveOnboarding(form);
            router.replace("/dashboard");
            router.refresh();
        });
    }
    function skip() {
        start(async () => {
            await skipOnboarding();
            router.replace("/dashboard");
            router.refresh();
        });
    }

    const canNext =
        step === 0 ? !!form.occupation :
        step === 1 ? !!form.domain :
        step === 2 ? form.interests.length > 0 :
        true;

    const activeOcc = OCCUPATIONS.find((o) => o.value === form.occupation);

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A] px-5 py-10 text-white">
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.16),_transparent_70%)] blur-3xl" />

            <div className="relative z-10 w-full max-w-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">Welcome, {displayName}</p>
                        <h1 className="mt-1 text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-oswald)" }}>
                            Let&apos;s personalize your journey
                        </h1>
                    </div>
                    <button onClick={skip} disabled={pending} className="text-sm text-white/50 transition hover:text-white">
                        Skip for now
                    </button>
                </div>

                {/* Progress */}
                <div className="mb-6 flex gap-1.5">
                    {Array.from({ length: TOTAL }).map((_, i) => (
                        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition", i <= step ? "bg-gradient-to-r from-orange-600 to-red-600" : "bg-white/10")} />
                    ))}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
                    {/* Step 0 — occupation */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">What best describes you?</h2>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {OCCUPATIONS.map((o) => {
                                    const Icon = o.icon;
                                    const active = form.occupation === o.value;
                                    return (
                                        <button
                                            key={o.value}
                                            onClick={() => set("occupation", o.value)}
                                            className={cn("flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-sm transition", active ? "border-[#f15906] bg-[#f15906]/10 text-white" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20")}
                                        >
                                            <Icon className={cn("size-6", active ? "text-[#f15906]" : "text-white/50")} />
                                            {o.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {activeOcc && (
                                <div className="space-y-3 pt-2">
                                    <label className="block text-sm font-medium text-white/80">
                                        {activeOcc.detailLabel}
                                        <input className={cn(input, "mt-1.5")} value={form.occupation_detail} onChange={(e) => set("occupation_detail", e.target.value)} placeholder={form.occupation === "student" ? "e.g. Computer Science" : "e.g. Product Designer"} />
                                    </label>
                                    <label className="block text-sm font-medium text-white/80">
                                        {form.occupation === "student" ? "School / University" : "Company / Organization"} <span className="text-white/40">(optional)</span>
                                        <input className={cn(input, "mt-1.5")} value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="Where?" />
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1 — domain */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Which field are you most into?</h2>
                            <div className="flex flex-wrap gap-2">
                                {DOMAINS.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => set("domain", d)}
                                        className={cn("rounded-full border px-4 py-2 text-sm transition", form.domain === d ? "border-[#f15906] bg-[#f15906]/15 text-white" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20")}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2 — interests */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">What do you love? <span className="text-sm font-normal text-white/40">(pick a few)</span></h2>
                            <div className="flex flex-wrap gap-2">
                                {INTERESTS.map((i) => {
                                    const active = form.interests.includes(i);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => toggleInterest(i)}
                                            className={cn("inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition", active ? "border-[#f15906] bg-[#f15906]/15 text-white" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20")}
                                        >
                                            {active && <Check className="size-3.5" />}
                                            {i}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — experience + goals */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-white">Where are you on the path?</h2>
                            <div className="flex flex-wrap gap-2">
                                {LEVELS.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => set("experience_level", l)}
                                        className={cn("rounded-full border px-4 py-2 text-sm transition", form.experience_level === l ? "border-[#f15906] bg-[#f15906]/15 text-white" : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20")}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                            <label className="block text-sm font-medium text-white/80">
                                What do you hope to get from Ancient AI? <span className="text-white/40">(optional)</span>
                                <textarea className={cn(input, "mt-1.5")} rows={3} value={form.goals} onChange={(e) => set("goals", e.target.value)} placeholder="Your intention…" />
                            </label>
                        </div>
                    )}

                    {/* Nav */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0 || pending}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-40"
                        >
                            <ArrowLeft className="size-4" /> Back
                        </button>
                        {step < TOTAL - 1 ? (
                            <button
                                onClick={() => setStep((s) => Math.min(TOTAL - 1, s + 1))}
                                disabled={!canNext}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-50"
                            >
                                Next <ArrowRight className="size-4" />
                            </button>
                        ) : (
                            <button
                                onClick={finish}
                                disabled={pending}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-60"
                            >
                                {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Finish
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
