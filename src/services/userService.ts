import { db } from '../db/connection';
import { users, userGroups } from '../db/schema';
import { eq, desc, count, and } from 'drizzle-orm';
import type { PaginationQuery } from '../types';

class UserService {
  async getAllUsers(pagination: PaginationQuery) {
    const { limit, offset } = pagination;

    const [data, totalCountResult] = await Promise.all([
      db
        .select()
        .from(users)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(users.createdAt)),
      db.select({ count: count() }).from(users),
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    return {
      data,
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasMore: offset + limit < totalCount,
      },
    };
  }

  async getUserById(id: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async removeUserFromGroup(userId: number, groupId: number) {
    await db
      .delete(userGroups)
      .where(and(eq(userGroups.userId, userId), eq(userGroups.groupId, groupId)));

    return true;
  }
}

const userService = new UserService();
export { userService as UserService };
