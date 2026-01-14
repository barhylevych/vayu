import { z } from 'zod';

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().min(0).max(100).default(2),
  offset: z.coerce.number().int().min(0).default(0),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const removeUserFromGroupParamsSchema = z.object({
  userId: z.coerce.number().int().positive(),
  groupId: z.coerce.number().int().positive(),
});

export type RemoveUserFromGroupParams = z.infer<
  typeof removeUserFromGroupParamsSchema
>;
