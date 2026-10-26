import { useForgeClient } from "@forge/code-client";
import { z } from "zod";

const BudgetSchema = z.object({
  dailyBudgetCredits: z.number().nonnegative(),
  remainingCredits: z.number().nonnegative(),
});

/**
 * Budget days are local midnights on the Forge side, so `/models` must carry
 * this machine's IANA timezone. Without it the broker falls back to a UTC day
 * and filters the catalog down to $-band models whenever that day is over
 * budget.
 */
export const localTimezone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export const readForgeUsage = async (): Promise<string> => {
  const forge = await useForgeClient();
  const usage = await forge.usage().value;
  const budget = BudgetSchema.safeParse(usage?.budget);

  if (!budget.success) {
    throw new Error("Forge returned an invalid balance.");
  }

  const { remainingCredits: available, dailyBudgetCredits: total } = budget.data;

  return `Forge daily credits\nAvailable: ${available.toFixed(2)} credits\nTotal: ${total.toFixed(2)} credits`;
};
