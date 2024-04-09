import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
    driver: "d1",
    out: "./drizzle",
    dbCredentials: {
        wranglerConfigPath: "./wrangler.toml",
        dbName: "time-tracker",
    },
    // Print all statements
    verbose: true,
    // Always ask for confirmation
    strict: true,
} satisfies Config;
