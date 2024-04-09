import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export function getPrismaClient(event: any) {
    const adapter = new PrismaD1(event.context.cloudflare.env.DB);
    const prisma = new PrismaClient({ adapter });

    return prisma;
}
