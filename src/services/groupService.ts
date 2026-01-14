import { db } from '../db/connection';
import { groups, userGroups } from '../db/schema';
import { eq, desc, count } from 'drizzle-orm';
import type { PaginationQuery } from '../types';

class GroupService {
  async getAllGroups(pagination: PaginationQuery) {
    const { limit, offset } = pagination;

    const [data, totalCountResult] = await Promise.all([
      db
        .select()
        .from(groups)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(groups.createdAt)),
      db.select({ count: count() }).from(groups),
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

  async getGroupById(id: number) {
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, id))
      .limit(1);

    return group;
  }

  async getGroupMemberCount(groupId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(userGroups)
      .where(eq(userGroups.groupId, groupId));

    return result?.count || 0;
  }

  async updateGroupStatus(groupId: number, status: 'Empty' | 'NotEmpty') {
    const [group] = await db
      .update(groups)
      .set({ status })
      .where(eq(groups.id, groupId))
      .returning();

    return group;
  }
}

const groupService = new GroupService();
export { groupService as GroupService };
