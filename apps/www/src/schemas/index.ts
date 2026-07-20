import z from "zod";

export const NumberFilter = z
  .string()
  .pipe(z.coerce.number())
  .optional()
  .catch(undefined);

export type NumberFilterInput = z.input<typeof NumberFilter>;
export type NumberFilterOutput = z.output<typeof NumberFilter>;
