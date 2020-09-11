import {PrismaClient} from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://" + process.env.POSTGRES_USER + ":" + process.env.POSTGRES_PASSWORD + "@" + process.env.POSTGRES_HOST + ":5432/" + process.env.POSTGRES_DB + "?schema=public"
        }
    }
});
