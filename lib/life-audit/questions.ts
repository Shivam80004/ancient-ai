// AncientAI — Life Audit question bank (pool of 22).
// Transcribed verbatim from specs/ancientai-life-audit.md.
//
// Per session, 7 questions run: Q1 (q_root) + one rapport + the 4 fixed track
// questions + Q7 (q_closer_1). Only Q1 and Q7 are the same for everyone;
// everything in between depends on how Q1 was answered. The `*_ALT` questions
// live in the pool but are not used by the default session builder.

import type { Question, Track } from "./types";

// ── Q1 — the opener (universal) ──────────────────────────────────────────────
export const Q_ROOT: Question = {
    id: "q_root",
    kind: "universal",
    scored: true,
    prompt:
        "When your mind gets five free minutes, no phone, nothing to do, where does it usually go?",
    options: [
        {
            id: "root_past",
            label: "Replaying something that already happened",
            scores: { mind_attention: 2 },
            track: "A",
        },
        {
            id: "root_future",
            label: "Where I want to be in a few years",
            scores: { purpose_direction: 2 },
            track: "B",
        },
        {
            id: "root_people",
            label: "Someone I haven't checked in on in a while",
            scores: { relationships: 2 },
            track: "C",
        },
    ],
};

// ── Q2 — rapport (universal, not scored) ─────────────────────────────────────
export const RAPPORT_QUESTIONS: Question[] = [
    {
        id: "q_rapport_1",
        kind: "rapport",
        scored: false,
        freeText: true,
        prompt:
            "Okay, switching gears. What's a movie you could rewatch on literally any day, no questions asked?",
        note: "We'll tell you ours too.",
        options: [],
    },
    {
        id: "q_rapport_2",
        kind: "rapport",
        scored: false,
        freeText: true,
        prompt: "Random one: what's a song that instantly fixes your mood?",
        options: [],
    },
    {
        id: "q_rapport_3",
        kind: "rapport",
        scored: false,
        freeText: true,
        prompt:
            "What's something you were low-key obsessed with as a kid that you still think about?",
        options: [],
    },
];

// ── Track A — Head & Heart (mind_attention, spiritual_curiosity) ─────────────
const TRACK_A: Question[] = [
    {
        id: "qA1",
        kind: "track",
        scored: true,
        prompt: "Do you replay conversations in your head after they're over?",
        options: [
            { id: "qA1_a", label: "All the time, I could write the transcript", scores: { mind_attention: 3 } },
            { id: "qA1_b", label: "Sometimes, if something felt off", scores: { mind_attention: 1, identity_selfworth: 1 } },
            { id: "qA1_c", label: "Rarely, once it's done it's done", scores: { habits_discipline: 1 } },
        ],
    },
    {
        id: "qA2",
        kind: "track",
        scored: true,
        prompt: "When something's bothering you, what usually happens?",
        options: [
            { id: "qA2_a", label: "I think about it until I've thought it to death", scores: { mind_attention: 2 } },
            { id: "qA2_b", label: "I go looking for an answer — books, podcasts, random advice", scores: { spiritual_curiosity: 2 } },
            { id: "qA2_c", label: "I talk to someone about it", scores: { relationships: 2 } },
        ],
    },
    {
        id: "qA3",
        kind: "track",
        scored: true,
        prompt: "Be honest, how many self-improvement things have you started and not finished?",
        options: [
            { id: "qA3_a", label: "Too many to count, but I mean it every time", scores: { spiritual_curiosity: 3 } },
            { id: "qA3_b", label: "A few, but I'm still doing one of them", scores: { habits_discipline: 1, spiritual_curiosity: 1 } },
            { id: "qA3_c", label: "Not really my thing", scores: { mind_attention: 1 } },
        ],
    },
    {
        id: "qA4",
        kind: "track",
        scored: true,
        prompt: 'What does "peace of mind" look like for you right now?',
        options: [
            { id: "qA4_a", label: "Just quiet, no noise in my head", scores: { mind_attention: 2 } },
            { id: "qA4_b", label: "Finally understanding what I actually believe", scores: { spiritual_curiosity: 3 } },
            { id: "qA4_c", label: "Not caring so much what people think", scores: { identity_selfworth: 2 } },
        ],
    },
];

export const QA5_ALT: Question = {
    id: "qA5",
    kind: "track",
    scored: true,
    prompt: "Do you ever feel like you're overthinking something that shouldn't matter this much?",
    options: [
        { id: "qA5_a", label: "Constantly", scores: { mind_attention: 3 } },
        { id: "qA5_b", label: "Only with big decisions", scores: { mind_attention: 1, identity_selfworth: 1 } },
        { id: "qA5_c", label: "Not really, I move on fast", scores: { habits_discipline: 1 } },
    ],
};

// ── Track B — Direction & Drive (purpose_direction, habits_discipline) ───────
const TRACK_B: Question[] = [
    {
        id: "qB1",
        kind: "track",
        scored: true,
        prompt: 'Do you have a five-year plan, or are you more "let\'s see what happens"?',
        options: [
            { id: "qB1_a", label: "Yeah, pretty mapped out", scores: { purpose_direction: 3 } },
            { id: "qB1_b", label: "Rough direction, figuring out details as I go", scores: { purpose_direction: 1, habits_discipline: 1 } },
            { id: "qB1_c", label: "Not really, I like keeping options open", scores: { spiritual_curiosity: 1 } },
        ],
    },
    {
        id: "qB2",
        kind: "track",
        scored: true,
        prompt: "When you set a goal, what usually happens?",
        options: [
            { id: "qB2_a", label: "I build a system and stick to it", scores: { habits_discipline: 3 } },
            { id: "qB2_b", label: "I get excited, then life happens", scores: { purpose_direction: 1 } },
            { id: "qB2_c", label: "I finish it, then immediately want the next one", scores: { purpose_direction: 2, habits_discipline: 1 } },
        ],
    },
    {
        id: "qB3",
        kind: "track",
        scored: true,
        prompt:
            'Which is more true: "I know what I want but not how to get there", or "I know how to work hard but not what I\'m working toward"?',
        options: [
            { id: "qB3_a", label: "Know the what, not the how", scores: { purpose_direction: 3 } },
            { id: "qB3_b", label: "Know the how, not the what", scores: { habits_discipline: 3 } },
            { id: "qB3_c", label: "Honestly, neither is clear right now", scores: { spiritual_curiosity: 2 } },
        ],
    },
    {
        id: "qB4",
        kind: "track",
        scored: true,
        prompt: "Do you track your habits, sleep, workouts, routines, or just go with the flow?",
        options: [
            { id: "qB4_a", label: "Tracked, structured, non-negotiable", scores: { habits_discipline: 3 } },
            { id: "qB4_b", label: "Loosely, when I remember", scores: { habits_discipline: 1 } },
            { id: "qB4_c", label: "Not at all, and it doesn't bother me", scores: { purpose_direction: 1 } },
        ],
    },
];

export const QB5_ALT: Question = {
    id: "qB5",
    kind: "track",
    scored: true,
    prompt: "If you had a completely free year with money handled, what would you actually do with it?",
    options: [
        { id: "qB5_a", label: "Build something — a project, a business, a skill", scores: { purpose_direction: 3 } },
        { id: "qB5_b", label: "Get my systems together — health, routine, discipline", scores: { habits_discipline: 2 } },
        { id: "qB5_c", label: "Travel, explore, figure out what I even want", scores: { spiritual_curiosity: 2 } },
    ],
};

// ── Track C — People & Presence (relationships, identity_selfworth) ──────────
const TRACK_C: Question[] = [
    {
        id: "qC1",
        kind: "track",
        scored: true,
        prompt:
            "How many people could you call right now, at a bad moment, and know they'd pick up?",
        options: [
            { id: "qC1_a", label: "A handful, easily", scores: { relationships: 1 } },
            { id: "qC1_b", label: "Maybe one or two", scores: { relationships: 2, identity_selfworth: 1 } },
            { id: "qC1_c", label: "Honestly, I'm not sure", scores: { relationships: 3, identity_selfworth: 2 } },
        ],
    },
    {
        id: "qC2",
        kind: "track",
        scored: true,
        prompt: "Do you find it easy to ask for help when you need it?",
        options: [
            { id: "qC2_a", label: "Yeah, I ask without overthinking it", scores: { identity_selfworth: 1 } },
            { id: "qC2_b", label: "I can, but I hesitate first", scores: { identity_selfworth: 2 } },
            { id: "qC2_c", label: "Not really, I'd rather figure it out alone", scores: { identity_selfworth: 3, relationships: 1 } },
        ],
    },
    {
        id: "qC3",
        kind: "track",
        scored: true,
        prompt: "When was the last time you felt truly understood by someone?",
        options: [
            { id: "qC3_a", label: "Recently", scores: { relationships: 1 } },
            { id: "qC3_b", label: "It's been a while", scores: { relationships: 2 } },
            { id: "qC3_c", label: "Honestly, can't remember", scores: { relationships: 3, identity_selfworth: 1 } },
        ],
    },
    {
        id: "qC4",
        kind: "track",
        scored: true,
        prompt: "Do you feel closer to people, or more like you're performing around them?",
        options: [
            { id: "qC4_a", label: "Closer, mostly", scores: { relationships: 1 } },
            { id: "qC4_b", label: "Depends who it is", scores: { relationships: 1, identity_selfworth: 1 } },
            { id: "qC4_c", label: "Performing, more often than I'd like", scores: { identity_selfworth: 3 } },
        ],
    },
];

export const QC5_ALT: Question = {
    id: "qC5",
    kind: "track",
    scored: true,
    prompt: "If you disappeared for a week with no explanation, who'd actually notice fast?",
    options: [
        { id: "qC5_a", label: "A few people, for sure", scores: { relationships: 1 } },
        { id: "qC5_b", label: "One or two", scores: { relationships: 2 } },
        { id: "qC5_c", label: "I genuinely don't know", scores: { relationships: 3 } },
    ],
};

/** The four fixed deep-dive questions for each track. */
export const TRACK_QUESTIONS: Record<Track, Question[]> = {
    A: TRACK_A,
    B: TRACK_B,
    C: TRACK_C,
};

// ── Q7 — the closer (universal) ──────────────────────────────────────────────
export const Q_CLOSER_1: Question = {
    id: "q_closer_1",
    kind: "closer",
    scored: true,
    prompt:
        "Last one. If we could hand you exactly one thing right now, clarity, calm, connection, or momentum, which would you take?",
    options: [
        { id: "closer1_clarity", label: "Clarity", scores: { purpose_direction: 2 } },
        { id: "closer1_calm", label: "Calm", scores: { mind_attention: 2 } },
        { id: "closer1_connection", label: "Connection", scores: { relationships: 2 } },
        { id: "closer1_momentum", label: "Momentum", scores: { habits_discipline: 2 } },
    ],
};

export const Q_CLOSER_2_ALT: Question = {
    id: "q_closer_2",
    kind: "closer",
    scored: false,
    prompt:
        'One more: on a scale from "I\'ve got it together" to "still figuring it out", where are you today?',
    options: [
        { id: "closer2_together", label: "Mostly together" },
        { id: "closer2_between", label: "Somewhere in between" },
        { id: "closer2_figuring", label: "Honestly, still figuring it out" },
    ],
};

export const Q_CLOSER_3_ALT: Question = {
    id: "q_closer_3",
    kind: "closer",
    scored: false,
    freeText: true,
    prompt:
        "Last thing: if this quiz told you something you already kind of knew deep down, what do you think it'd be?",
    note: "Optional.",
    options: [],
};

/** The whole pool of 22 questions, for reference / admin tooling. */
export const QUESTION_BANK: Question[] = [
    Q_ROOT,
    ...RAPPORT_QUESTIONS,
    ...TRACK_A,
    QA5_ALT,
    ...TRACK_B,
    QB5_ALT,
    ...TRACK_C,
    QC5_ALT,
    Q_CLOSER_1,
    Q_CLOSER_2_ALT,
    Q_CLOSER_3_ALT,
];
