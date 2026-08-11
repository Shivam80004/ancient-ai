// AncientAI — Life Audit
// Shared types for the adaptive onboarding quiz.
// See specs/ancientai-life-audit.md for the source of truth.

/** The six scored dimensions. `identity_selfworth` is a modifier that never
 *  wins outright — it folds into whichever other dimension it co-occurred
 *  with most during a session (see scoring.ts). */
export type Dimension =
    | "mind_attention"
    | "identity_selfworth"
    | "habits_discipline"
    | "relationships"
    | "purpose_direction"
    | "spiritual_curiosity";

export const DIMENSIONS: Dimension[] = [
    "mind_attention",
    "identity_selfworth",
    "habits_discipline",
    "relationships",
    "purpose_direction",
    "spiritual_curiosity",
];

/** Q1 routes the whole session into one of three tracks. */
export type Track = "A" | "B" | "C";

/** The five possible archetype results (identity_selfworth is never a result). */
export type ArchetypeId =
    | "overthinking_mind"
    | "distracted_seeker"
    | "purpose_explorer"
    | "disciplined_achiever"
    | "lonely_connector";

export type ScoreMap = Partial<Record<Dimension, number>>;

export type Option = {
    id: string;
    label: string;
    /** Points this option adds. Omitted / empty for unscored (rapport) options. */
    scores?: ScoreMap;
    /** Only present on q_root options — the track this answer routes into. */
    track?: Track;
};

export type QuestionKind = "universal" | "rapport" | "track" | "closer";

export type Question = {
    id: string;
    kind: QuestionKind;
    prompt: string;
    /** A one-line playful note shown under some prompts. */
    note?: string;
    /** Whether answers on this question contribute to scoring. */
    scored: boolean;
    /** Multiple-choice options. Empty for pure free-text rapport prompts. */
    options: Option[];
    /** Rapport prompts accept an optional free-text response instead of options. */
    freeText?: boolean;
};

export type Archetype = {
    id: ArchetypeId;
    /** The dimension whose win produces this archetype. */
    primary: Dimension;
    title: string;
    /** The reflective description shown on the result screen. */
    description: string;
    freeLesson: string;
    challenge: string;
};

/** A single recorded answer during a session. */
export type Answer = {
    questionId: string;
    /** Selected option id, or null for a free-text / skipped rapport prompt. */
    optionId: string | null;
    /** Free-text value for rapport prompts. */
    text?: string;
};

/** The computed outcome of a completed session. */
export type LifeAuditResult = {
    track: Track;
    archetype: ArchetypeId;
    /** Final per-dimension scores after the identity fold. */
    scores: Record<Dimension, number>;
    /** The dimension that won. */
    winningDimension: Dimension;
    /** Dimension the Q1 opener pointed to (for tiebreak + records). */
    rootDimension: Dimension;
    /** Dimension the Q7 closer pointed to, if any. */
    closerDimension: Dimension | null;
    answers: Answer[];
    completedAt: string;
};
