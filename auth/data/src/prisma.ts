import {PrismaClient} from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: process.env.POSTGRES_CONNECTION_URL
        }
    }
});
