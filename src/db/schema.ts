import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const groupStatusEnum = pgEnum('group_status', ['Empty', 'NotEmpty']);

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: groupStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userGroups = pgTable(
  'user_groups',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.userId, table.groupId] }),
  })
);
