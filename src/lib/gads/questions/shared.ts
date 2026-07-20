import type { GadsQuestion } from "@/lib/gads/types";

/** Authored content omits `id` - ids are assigned sequentially AFTER the
 * question order is shuffled per pickAndAssembleGadsExam() in ./index.ts,
 * so the source order below carries no information about final position. */
export type AuthoredGadsQuestion = Omit<GadsQuestion, "id">;
