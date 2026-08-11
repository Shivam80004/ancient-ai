// AncientAI — Life Audit scoring.
//
// Rules (from the spec):
//  - Every answer adds points to 1–2 of six dimensions.
//  - Identity & self-worth never wins outright. It folds into whichever OTHER
//    dimension it showed up alongside most in that session.
//  - After Q7, the highest-scoring dimension determines the archetype.
//  - If the top two dimensions are within 2 points, the tiebreak prefers the
//    Q1 track, then whatever Q7 pointed to.

import { QUESTION_BANK } from "./questions";
import { DIMENSION_TO_ARCHETYPE } from "./results";
import {
    DIMENSIONS,
    type Answer,
    type ArchetypeId,
    type Dimension,
    type LifeAuditResult,
    type Option,
    type Track,
} from "./types";

const SCORABLE_DIMENSIONS = DIMENSIONS.filter(
    (d): d is Exclude<Dimension, "identity_selfworth"> => d !== "identity_selfworth",
);

function emptyScores(): Record<Dimension, number> {
    return {
        mind_attention: 0,
        identity_selfworth: 0,
        habits_discipline: 0,
        relationships: 0,
        purpose_direction: 0,
        spiritual_curiosity: 0,
    };
}

/** Build a fast lookup of every option in the bank by its id. */
const OPTION_INDEX: Map<string, Option> = (() => {
    const map = new Map<string, Option>();
    for (const q of QUESTION_BANK) {
        for (const opt of q.options) map.set(opt.id, opt);
    }
    return map;
})();

function resolveOption(answer: Answer): Option | undefined {
    return answer.optionId ? OPTION_INDEX.get(answer.optionId) : undefined;
}

/** The dimension the Q1 opener pointed to, derived from its option scores. */
function dimensionOf(option: Option | undefined): Dimension | null {
    if (!option?.scores) return null;
    // Q1 / Q7 options score a single dimension; return the highest-weighted one.
    let best: Dimension | null = null;
    let bestVal = -Infinity;
    for (const dim of DIMENSIONS) {
        const v = option.scores[dim] ?? 0;
        if (v > bestVal) {
            bestVal = v;
            best = dim;
        }
    }
    return bestVal > 0 ? best : null;
}

export type ScoreOutcome = {
    scores: Record<Dimension, number>;
    winningDimension: Dimension;
    archetype: ArchetypeId;
    rootDimension: Dimension;
    closerDimension: Dimension | null;
};

/**
 * Score a completed set of answers.
 *
 * @param answers   The recorded answers for the session (rapport answers are
 *                  ignored automatically since their options carry no scores).
 * @param track     The track chosen at Q1 (used for tiebreak preference).
 * @param rootDimension   Dimension Q1 pointed to (tiebreak). If omitted it is
 *                        derived from the q_root answer.
 * @param closerDimension Dimension Q7 pointed to (tiebreak). If omitted it is
 *                        derived from the q_closer answer.
 */
export function scoreSession(
    answers: Answer[],
    track: Track,
    rootDimension?: Dimension,
    closerDimension?: Dimension | null,
): ScoreOutcome {
    const scores = emptyScores();

    // Track which other dimension identity_selfworth co-occurs with, and how
    // often, so we can fold it in later.
    const identityCoOccurrence: Record<Dimension, number> = emptyScores();
    let identityTotal = 0;

    const rootAnswer = answers.find((a) => a.questionId === "q_root");
    const closerAnswer = answers.find((a) => a.questionId.startsWith("q_closer"));

    const derivedRoot = rootDimension ?? dimensionOf(resolveOption(rootAnswer ?? { questionId: "", optionId: null }));
    const derivedCloser =
        closerDimension !== undefined
            ? closerDimension
            : dimensionOf(resolveOption(closerAnswer ?? { questionId: "", optionId: null }));

    for (const answer of answers) {
        const option = resolveOption(answer);
        if (!option?.scores) continue;

        // Tally raw points.
        for (const dim of DIMENSIONS) {
            const pts = option.scores[dim] ?? 0;
            if (pts) scores[dim] += pts;
        }

        // Record identity co-occurrence within this single option.
        const identityPts = option.scores.identity_selfworth ?? 0;
        if (identityPts > 0) {
            identityTotal += identityPts;
            for (const dim of SCORABLE_DIMENSIONS) {
                if ((option.scores[dim] ?? 0) > 0) identityCoOccurrence[dim] += 1;
            }
        }
    }

    // ── Fold identity_selfworth into its most-co-occurring dimension ─────────
    // Identity never wins outright, so its own tally is removed from contention
    // and its points are added to the dimension it appeared alongside most.
    scores.identity_selfworth = 0;

    if (identityTotal > 0) {
        const foldTarget = pickFoldTarget(identityCoOccurrence, scores, derivedRoot);
        if (foldTarget) scores[foldTarget] += identityTotal;
        // If identity never co-occurred with another dimension, its points are
        // dropped — it can never produce a result on its own.
    }

    const winningDimension = pickWinner(scores, derivedRoot, derivedCloser);
    const archetype =
        DIMENSION_TO_ARCHETYPE[
            winningDimension as Exclude<Dimension, "identity_selfworth">
        ];

    return {
        scores,
        winningDimension,
        archetype,
        rootDimension: derivedRoot ?? trackToDimension(track),
        closerDimension: derivedCloser ?? null,
    };
}

/** The dimension identity folds into: most co-occurrences, tiebroken by the Q1
 *  track dimension, then by the higher running score. */
function pickFoldTarget(
    coOccurrence: Record<Dimension, number>,
    scores: Record<Dimension, number>,
    rootDimension: Dimension | null,
): Exclude<Dimension, "identity_selfworth"> | null {
    let best: Exclude<Dimension, "identity_selfworth"> | null = null;
    let bestCount = 0;

    for (const dim of SCORABLE_DIMENSIONS) {
        const count = coOccurrence[dim];
        if (count <= 0) continue;
        if (
            count > bestCount ||
            (count === bestCount &&
                best !== null &&
                breaksTieForFold(dim, best, scores, rootDimension))
        ) {
            best = dim;
            bestCount = count;
        }
    }
    return best;
}

function breaksTieForFold(
    candidate: Exclude<Dimension, "identity_selfworth">,
    current: Exclude<Dimension, "identity_selfworth">,
    scores: Record<Dimension, number>,
    rootDimension: Dimension | null,
): boolean {
    if (rootDimension) {
        if (candidate === rootDimension && current !== rootDimension) return true;
        if (current === rootDimension && candidate !== rootDimension) return false;
    }
    return scores[candidate] > scores[current];
}

/** Pick the winning dimension among the five scorable dimensions, applying the
 *  within-2-points tiebreak (prefer Q1 track, then Q7). */
function pickWinner(
    scores: Record<Dimension, number>,
    rootDimension: Dimension | null,
    closerDimension: Dimension | null,
): Dimension {
    const ranked = [...SCORABLE_DIMENSIONS].sort((a, b) => scores[b] - scores[a]);
    const [top, second] = ranked;

    if (second === undefined || scores[top] - scores[second] > 2) {
        return top;
    }

    // Top two are within 2 points — gather everyone tied within the window.
    const contenders = ranked.filter((d) => scores[top] - scores[d] <= 2);

    if (rootDimension && contenders.some((d) => d === rootDimension)) return rootDimension;
    if (closerDimension && contenders.some((d) => d === closerDimension)) return closerDimension;
    return top;
}

const TRACK_DIMENSION: Record<Track, Dimension> = {
    A: "mind_attention",
    B: "purpose_direction",
    C: "relationships",
};

export function trackToDimension(track: Track): Dimension {
    return TRACK_DIMENSION[track];
}

/** Convenience: compute the full persisted result for a session. */
export function buildResult(
    answers: Answer[],
    track: Track,
): LifeAuditResult {
    const outcome = scoreSession(answers, track);
    return {
        track,
        archetype: outcome.archetype,
        scores: outcome.scores,
        winningDimension: outcome.winningDimension,
        rootDimension: outcome.rootDimension,
        closerDimension: outcome.closerDimension,
        answers,
        completedAt: new Date().toISOString(),
    };
}
