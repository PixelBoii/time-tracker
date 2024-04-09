import { drizzle } from "drizzle-orm/d1";
import { H3Event } from "h3";
import * as schema from "../drizzle/schema";

export function getDb(event: H3Event) {
    const db = drizzle(event.context.cloudflare.env.DB as D1Database, {
        schema,
    });

    return db;
}
