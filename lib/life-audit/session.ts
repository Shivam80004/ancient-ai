// AncientAI — Life Audit session assembly.
//
// A session is always 7 questions:
//   1. q_root (universal opener — decides the track)
//   2. one rapport question (universal, not scored, picked at random)
//   3–6. the four fixed deep-dive questions for the chosen track
//   7. q_closer_1 (universal closer / tiebreaker)
//
// Q1 is fixed for everyone; the rapport question and the track questions vary.

import {
    Q_CLOSER_1,
    Q_ROOT,
    RAPPORT_QUESTIONS,
    TRACK_QUESTIONS,
} from "./questions";
import type { Option, Question, Track } from "./types";

/** Resolve the track a q_root option routes into. */
export function trackForRootOption(optionId: string): Track | null {
    const opt = Q_ROOT.options.find((o) => o.id === optionId);
    return opt?.track ?? null;
}

function pickRapport(seed?: number): Question {
    const i =
        seed === undefined
            ? Math.floor(Math.random() * RAPPORT_QUESTIONS.length)
            : ((seed % RAPPORT_QUESTIONS.length) + RAPPORT_QUESTIONS.length) %
              RAPPORT_QUESTIONS.length;
    return RAPPORT_QUESTIONS[i];
}

/**
 * Build the ordered list of questions after Q1 for a given track.
 * Returns [rapport, ...4 track questions, closer].
 *
 * A `rapportSeed` can be passed for deterministic selection (e.g. tests / SSR);
 * otherwise a rapport question is chosen at random.
 */
export function buildTrackQuestions(track: Track, rapportSeed?: number): Question[] {
    return [pickRapport(rapportSeed), ...TRACK_QUESTIONS[track], Q_CLOSER_1];
}

/** The full 7-question session for a chosen track (Q1 included). */
export function buildSession(track: Track, rapportSeed?: number): Question[] {
    return [Q_ROOT, ...buildTrackQuestions(track, rapportSeed)];
}

export function findOption(question: Question, optionId: string): Option | undefined {
    return question.options.find((o) => o.id === optionId);
}

export { Q_ROOT };
