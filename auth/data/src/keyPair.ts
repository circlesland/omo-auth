import {prisma} from "./prisma";
import {KeyGenerator} from "@omo/auth-util/dist/keyGenerator";

export class KeyPair
{
    public static async findPublicKeyById(id: number)
    {
        return await prisma.keyPairs.findOne({
            where: {
                id: id
            },
            select: {
                id: true,
                publicKeyPem: true,
                validTo: true
            }
        });
    }

    public static async findValidKey()
    {
        const now = new Date();

        const validKeyPairs = await prisma.keyPairs.findMany({
                where: {
                    validFrom: {
                        lte: now
                    },
                    validTo: {
                        gt: now
                    }
                }
            }
        );

        if (validKeyPairs.length > 1)
        {
            throw new Error("There exists more than one valid key pair.");
        }
        if (validKeyPairs.length == 0)
        {
            return null;
        }
        return validKeyPairs[0];
    }

    public static async createKeyPair()
    {
        if (!process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS)
            throw new Error("process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS is not set!");

        const newKeyPair = await KeyGenerator.generateRsaKeyPair();
        const now = new Date();
        const newKeyPairEntry = await prisma.keyPairs.create({
            data: {
                privateKeyPem: newKeyPair.privateKeyPem,
                publicKeyPem: newKeyPair.publicKeyPem,
                privateKeyJwk: newKeyPair.privateKeyJwk,
                publicKeyJwk: newKeyPair.publicKeyJwk,
                validFrom: now,
                validTo: new Date(now.getTime() + (parseInt(process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS) * 1000))
            }
        });

        return newKeyPairEntry;
    }
}
