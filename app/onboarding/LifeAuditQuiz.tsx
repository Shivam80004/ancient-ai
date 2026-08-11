"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    Sparkles,
    BookOpen,
    CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Q_ROOT } from "@/lib/life-audit/questions";
import { buildTrackQuestions, trackForRootOption } from "@/lib/life-audit/session";
import { buildResult } from "@/lib/life-audit/scoring";
import { ARCHETYPES, DIMENSION_LABELS } from "@/lib/life-audit/results";
import type { Answer, LifeAuditResult, Question, Track } from "@/lib/life-audit/types";
import { saveLifeAudit } from "./actions";

const TOTAL = 7;
const input =
    "w-full rounded-2xl border border-white/10 bg-[#0f0c0b] px-4 py-3 text-white placeholder-white/30 shadow-inner shadow-black/40 transition focus:border-[#f15906] focus:outline-none focus:ring-2 focus:ring-[#f15906]/30";

export function LifeAuditQuiz({ displayName }: { displayName: string }) {
    const router = useRouter();
    const [pending, start] = useTransition();

    // A stable seed so the rapport question doesn't reshuffle on re-render.
    const rapportSeed = useMemo(() => Math.floor(Math.random() * 1000), []);

    const [track, setTrack] = useState<Track | null>(null);
    const [questions, setQuestions] = useState<Question[]>([Q_ROOT]);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [result, setResult] = useState<LifeAuditResult | null>(null);
    const [text, setText] = useState("");

    const current = questions[step];
    const currentAnswer = current ? answers[current.id] : undefined;

    // Keep the free-text field in sync with the current question's stored answer.
    useEffect(() => {
        if (current?.freeText) setText(currentAnswer?.text ?? "");
    }, [step, current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    function selectOption(optionId: string) {
        if (!current) return;

        // Q1 decides the track and unlocks the rest of the session.
        if (current.id === Q_ROOT.id) {
            const nextTrack = trackForRootOption(optionId);
            if (nextTrack) {
                setTrack(nextTrack);
                setQuestions([Q_ROOT, ...buildTrackQuestions(nextTrack, rapportSeed)]);
            }
        }
        setAnswers((prev) => ({ ...prev, [current.id]: { questionId: current.id, optionId } }));
    }

    function saveText() {
        if (!current) return;
        setAnswers((prev) => ({
            ...prev,
            [current.id]: { questionId: current.id, optionId: null, text: text.trim() || undefined },
        }));
    }

    const canAdvance = current?.freeText ? true : !!currentAnswer?.optionId;
    const isLast = step === TOTAL - 1;

    function next() {
        if (current?.freeText) saveText();
        if (!isLast) {
            setStep((s) => s + 1);
            return;
        }
        finish();
    }

    function finish() {
        if (!track) return;
        // Assemble answers in question order and compute the result client-side.
        const ordered: Answer[] = questions.map(
            (q) =>
                (q.freeText && q.id === current?.id
                    ? { questionId: q.id, optionId: null, text: text.trim() || undefined }
                    : answers[q.id]) ?? { questionId: q.id, optionId: null },
        );
        const computed = buildResult(ordered, track);
        setResult(computed);
    }

    if (result) {
        return <ResultScreen result={result} pending={pending} onContinue={() => {
            start(async () => {
                await saveLifeAudit(result);
                router.replace("/dashboard");
                router.refresh();
            });
        }} />;
    }

    if (!current) return null;

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A] px-5 py-10 text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.16),_transparent_70%)] blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(181,130,113,0.10),_transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 w-full max-w-xl">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                        Life Audit · {displayName}
                    </p>
                    <h1
                        className="mt-1 text-2xl font-semibold text-white"
                        style={{ fontFamily: "var(--font-oswald)" }}
                    >
                        Seven quick questions, just for you
                    </h1>
                </div>

                {/* Progress */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex flex-1 gap-1.5">
                        {Array.from({ length: TOTAL }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition",
                                    i <= step ? "bg-gradient-to-r from-orange-600 to-red-600" : "bg-white/10",
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-medium tabular-nums text-white/40">
                        {step + 1}/{TOTAL}
                    </span>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
                    <h2 className="text-lg font-medium leading-snug text-white">{current.prompt}</h2>
                    {current.note && <p className="mt-1.5 text-sm text-white/40">{current.note}</p>}

                    <div className="mt-5 space-y-3">
                        {current.freeText ? (
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={3}
                                placeholder="Type as much or as little as you like — this one's just for fun."
                                className={cn(input, "resize-none")}
                            />
                        ) : (
                            current.options.map((o) => {
                                const active = currentAnswer?.optionId === o.id;
                                return (
                                    <button
                                        key={o.id}
                                        onClick={() => selectOption(o.id)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm transition",
                                            active
                                                ? "border-[#f15906] bg-[#f15906]/10 text-white"
                                                : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:bg-white/[0.06]",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                                                active ? "border-[#f15906] bg-[#f15906] text-black" : "border-white/25",
                                            )}
                                        >
                                            {active && <Check className="size-3.5" strokeWidth={3} />}
                                        </span>
                                        {o.label}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Nav */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0 || pending}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-40"
                        >
                            <ArrowLeft className="size-4" /> Back
                        </button>
                        <button
                            onClick={next}
                            disabled={!canAdvance || pending}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-50"
                        >
                            {isLast ? (
                                <>
                                    {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                                    Reveal my result
                                </>
                            ) : (
                                <>
                                    Next <ArrowRight className="size-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-white/30">
                    No right answers. This just helps us point you at the right first step.
                </p>
            </div>
        </main>
    );
}

function ResultScreen({
    result,
    pending,
    onContinue,
}: {
    result: LifeAuditResult;
    pending: boolean;
    onContinue: () => void;
}) {
    const archetype = ARCHETYPES[result.archetype];
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        let cancelled = false;
        import("canvas-confetti").then(({ default: confetti }) => {
            if (cancelled) return;
            confetti({
                particleCount: 90,
                spread: 75,
                origin: { y: 0.35 },
                colors: ["#f15906", "#fc964c", "#B58271", "#F5F5F5"],
                scalar: 0.9,
            });
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0A0A0A] px-5 py-12 text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(241,89,6,0.20),_transparent_70%)] blur-3xl"
            />

            <div className="relative z-10 w-full max-w-xl">
                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#221b17] to-[#0d0a09] p-7 shadow-[0_45px_120px_rgba(0,0,0,0.6)] sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f15906]/80">
                        Your archetype
                    </p>
                    <h1
                        className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl"
                        style={{ fontFamily: "var(--font-oswald)" }}
                    >
                        {archetype.title}
                    </h1>
                    <p className="mt-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                        {DIMENSION_LABELS[archetype.primary]}
                    </p>

                    <p className="mt-5 text-sm leading-relaxed text-white/80">{archetype.description}</p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-center gap-2 text-[#f15906]">
                                <BookOpen className="size-4" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Free lesson</span>
                            </div>
                            <p className="mt-1.5 text-sm font-medium text-white">{archetype.freeLesson}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-center gap-2 text-[#f15906]">
                                <CalendarCheck className="size-4" />
                                <span className="text-xs font-semibold uppercase tracking-wide">7-day challenge</span>
                            </div>
                            <p className="mt-1.5 text-sm text-white/80">{archetype.challenge}</p>
                        </div>
                    </div>

                    <button
                        onClick={onContinue}
                        disabled={pending}
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 disabled:opacity-60"
                    >
                        {pending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                        Enter your dashboard
                    </button>
                </div>

                <p className="mt-4 text-center text-xs text-white/30">
                    Your result is saved — you can always revisit it from your profile.
                </p>
            </div>
        </main>
    );
}
