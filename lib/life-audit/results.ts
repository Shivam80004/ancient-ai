// AncientAI — Life Audit results.
// The five archetypes, keyed by the dimension whose win produces them.
// Copy transcribed from specs/ancientai-life-audit.md.

import type { Archetype, ArchetypeId, Dimension } from "./types";

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
    overthinking_mind: {
        id: "overthinking_mind",
        primary: "mind_attention",
        title: "The Overthinking Mind",
        description:
            "You think in loops — replaying, rehearsing, running scenarios that already happened or haven't happened yet. It's not a flaw, it's a mind that cares deeply and hasn't been given a place to rest. The work here isn't to think less, it's to think on purpose.",
        freeLesson: "Stilling the loop",
        challenge:
            "Five minutes of guided stillness, once a day, no phone in the room.",
    },
    distracted_seeker: {
        id: "distracted_seeker",
        primary: "spiritual_curiosity",
        title: "The Distracted Seeker",
        description:
            "You're genuinely curious — about meaning, growth, the bigger questions — but you've collected more starting points than finish lines. That's not a lack of discipline, it's a lack of a compass. Once you find the one thread worth pulling, you'll surprise yourself with how far you follow it.",
        freeLesson: "Picking one thread",
        challenge: "One practice only, no swapping, for seven days straight.",
    },
    purpose_explorer: {
        id: "purpose_explorer",
        primary: "purpose_direction",
        title: "The Purpose Explorer",
        description:
            'You know there\'s a "why" out there, and you\'re actively hunting for it. That already puts you ahead of most people, who never ask. The next step isn\'t finding more answers, it\'s testing the ones you already suspect are true.',
        freeLesson: "Naming the why",
        challenge:
            "Daily journal prompts that narrow a vague purpose into a specific one.",
    },
    disciplined_achiever: {
        id: "disciplined_achiever",
        primary: "habits_discipline",
        title: "The Disciplined Achiever",
        description:
            "You show up. Systems, routines, follow-through — you've already built the machinery most people are still trying to figure out. The real question isn't whether you can do the work, it's whether the work is pointed somewhere that actually matters to you.",
        freeLesson: "Discipline with direction",
        challenge:
            "Attach one existing habit to a purpose statement and track how it feels.",
    },
    lonely_connector: {
        id: "lonely_connector",
        primary: "relationships",
        title: "The Lonely Connector",
        description:
            "You care about people more than you let on, and you notice exactly how close, or not, you feel to the ones around you. Sometimes it's easier to give presence than to ask for it back. This one's about closing that gap, safely, on your terms.",
        freeLesson: "Letting someone in",
        challenge:
            "One small, low-stakes act of reaching out, every day for a week.",
    },
};

/** Which winning dimension maps to which archetype. Identity & self-worth is a
 *  modifier and never appears here — it folds into another dimension first. */
export const DIMENSION_TO_ARCHETYPE: Record<
    Exclude<Dimension, "identity_selfworth">,
    ArchetypeId
> = {
    mind_attention: "overthinking_mind",
    spiritual_curiosity: "distracted_seeker",
    purpose_direction: "purpose_explorer",
    habits_discipline: "disciplined_achiever",
    relationships: "lonely_connector",
};

export const DIMENSION_LABELS: Record<Dimension, string> = {
    mind_attention: "Mind & attention",
    identity_selfworth: "Identity & self-worth",
    habits_discipline: "Habits & discipline",
    relationships: "Relationships",
    purpose_direction: "Purpose & direction",
    spiritual_curiosity: "Spiritual curiosity",
};
