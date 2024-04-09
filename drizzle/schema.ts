import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("User", {
    id: integer("id").primaryKey(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    rememberMeToken: text("rememberMeToken"),
    createdAt: text("createdAt")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const timeRecords = sqliteTable("TimeRecord", {
    id: integer("id").primaryKey(),
    userId: integer("userId").notNull(),
    startAt: text("startAt").notNull(),
    stopAt: text("stopAt"),
    status: text("status").notNull(),
    name: text("name"),
    notes: text("notes", { mode: 'json' }),
    createdAt: text("createdAt")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
    timeRecords: many(timeRecords),
}));

export const timeRecordsRelations = relations(timeRecords, ({ one }) => ({
    user: one(users, {
        fields: [timeRecords.userId],
        references: [users.id],
    }),
}));
