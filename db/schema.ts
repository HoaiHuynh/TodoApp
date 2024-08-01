import { integer, sqliteTable, text, } from 'drizzle-orm/sqlite-core';

//#region SCHEMA
export const todos = sqliteTable('todos', {
    id: text('id').primaryKey(),
    title: text('title'),
    description: text('description'),
    complete: integer('complete'),
    priority: integer('priority'),
    label: text('label'),
    schedule: text('schedule'),
    createdAt: text('created_at')
        .notNull(),
    updatedAt: text('updated_at')
});

export const priorities = sqliteTable('priorities', {
    id: text('id').primaryKey(),
    name: text('name'),
    color: text('color'),
    createdAt: text('created_at')
        .notNull()
});

export const labels = sqliteTable('labels', {
    id: text('id').primaryKey(),
    name: text('name'),
    color: text('color'),
    createdAt: text('created_at')
        .notNull()
});
//#endregion SCHEMA

//#region TYPES
export type SelectTodo = typeof todos.$inferSelect;
export type SelectPriority = typeof priorities.$inferSelect;
export type SelectLabel = typeof labels.$inferSelect;
//#endregion TYPES