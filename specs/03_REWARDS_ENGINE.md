# 03 — Rewards Engine

The rewards engine is the heart of the gamification. It answers one question: **"Given everything a user has done, what have they now earned?"** It runs server-side after any point-earning event.

## Principles

- **Ledger is truth.** `point_ledger` is append-only. `profiles.total_points` (and `xp`) are cached values kept in sync by the `sync_points()` trigger. Never edit them directly.
- **Rules are data.** Admins create `reward_rules` rows. The engine reads them at runtime — changing a threshold never requires a deploy.
- **Idempotent.** Re-running the engine must not double-award. `earned_rewards` has `unique(user_id, rule_id)`; `lesson_completions` and course `point_ledger` refs guard against duplicates.

## Point sources

| Event | Points | Written when |
|---|---|---|
| Complete a course | `courses.points_reward` | last lesson of course completed |
| Complete a task | `tasks.points_reward` | task done (or admin-approved if `requires_approval`) |
| Daily streak bonus | rule-defined | first activity of the day, N-day streak |
| Claim a gift (spend) | `-gifts.point_cost` | claim requested |
| Admin adjustment | ± admin-entered | admin manual grant/deduct (`reason='admin_adjust'`) |

## Engine flow (pseudo-code)

```ts
// lib/rewards/engine.ts — runs with the SERVICE-ROLE client, server only
async function evaluateRewards(userId: string) {
  const stats = await gatherStats(userId); // points, coursesDone, tasksDone, completedSemesters[], streak
  const rules = await getActiveRules();

  for (const rule of rules) {
    if (!checkRule(rule, stats)) continue;

    // insert earned_reward if not already present (unique constraint = safety net)
    const inserted = await insertEarnedRewardIfNew(userId, rule);
    if (!inserted) continue; // already earned

    if (rule.reward_kind === 'certificate') await generateCertificate(userId, rule);
    if (rule.reward_kind === 'badge')       await grantBadge(userId, rule);
    // 'gift' rewards become claimable in the Goodies tab (not auto-shipped)
  }
}

function checkRule(rule, s) {
  switch (rule.rule_type) {
    case 'points_threshold':  return s.points   >= rule.threshold;
    case 'course_count':      return s.coursesDone >= rule.threshold;
    case 'task_count':        return s.tasksDone   >= rule.threshold;
    case 'semester_complete': return s.completedSemesters.includes(rule.semester_id);
    case 'streak_days':       return s.streak      >= rule.threshold;
  }
}
```

## Course completion logic

```ts
// called from app/api/complete-lesson/route.ts after session + enrollment checks
async function onLessonComplete(userId, lessonId) {
  await insertCompletionIdempotent(userId, lessonId);        // unique(user_id, lesson_id)
  const course = await courseOf(lessonId);
  const { done, total } = await courseProgress(userId, course.id);
  if (done === total) {
    await markEnrollmentComplete(userId, course.id);
    await addLedgerIfNew(userId, course.points_reward, 'course_complete', course.id); // idempotent by (reason, ref_id)
    await evaluateRewards(userId);
  }
}
```

## Streaks

On the first activity of a day (lesson completion or task done), update `streaks`:
- if `last_active_date === today` → no-op; if `=== yesterday` → `current_streak += 1`; else reset to 1.
- bump `longest_streak`; set `last_active_date = today`.
- then `evaluateRewards()` so any `streak_days` rule can fire. A streak-bonus point award (if configured) is a `point_ledger` insert with `reason='streak_bonus'`.

## Two kinds of rewards — keep them distinct

1. **Benchmark rewards (earned):** unlocked automatically when a rule is met (certificates, badges, "you've unlocked the Semester 1 goodie"). They appear in Goodies as *claimable* with no point cost.
2. **Point-shop rewards (purchased):** gifts with a `point_cost`. Claiming deducts points via a negative ledger entry. Guard against negative balances server-side.

## Claiming flow

```
User taps "Claim" on a gift  → POST /api/claim-gift (server)
  → server checks: earned OR (point_cost <= balance && stock > 0)
  → insert gift_claim (status 'requested')
  → if point_cost: add negative ledger entry, decrement stock (same transaction)
  → admin later approves/ships in Admin > Claims
```

## Anti-abuse checklist

- All awards go through the server; the browser never inserts to `point_ledger` (no user insert policy exists).
- Verify enrollment before completing a lesson.
- Unique constraints make replays no-ops.
- Balance + stock checked in the **same transaction** as the claim.
- Validate every route-handler/server-action input with `zod`.
