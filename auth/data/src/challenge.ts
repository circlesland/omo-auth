import {prisma} from "./prisma";
import {ValueGenerator} from "@omo/auth-util/dist/valueGenerator";

export interface RequestChallengeResponse
{
    success: boolean,
    errorMessage?: string,
    challenge?: string
    validTo?: Date
}

export interface VerifyChallengeResponse
{
    success: boolean,
    email?:string,
    appId?:string
}

export class Challenge
{
    public static async requestChallenge(forEmail:string, forAppId:string, length:number, validForNSeconds:number) : Promise<RequestChallengeResponse>
    {
        const now = new Date();

        const pendingChallenges = await prisma.challenges.findMany({
            where: {
                email: forEmail,
                done: false,
                validTo: {
                    gt: now
                }
            },
            select: {
                done:true,
                validTo:true
            }
        });

        if (pendingChallenges.length > 0) {
            return {
                success: false,
                errorMessage: "There is a pending challenge for this email address. " +
                    "Please solve it first or let it time-out before requesting a new one."
            }
        }

        const newChallenge = await prisma.challenges.create({
            data: {
                appId: forAppId,
                email: forEmail,
                validTo: new Date(new Date().getTime() + (validForNSeconds * 1000)),
                challenge: ValueGenerator.generateRandomUrlSafeString(length),
                done: false
            },
            select: {
                challenge: true,
                validTo: true
            }
        });

        return {
            success: true,
            challenge: newChallenge.challenge,
            validTo: newChallenge.validTo
        };
    }

    public static async verifyChallenge(challengeResponse:string) : Promise<VerifyChallengeResponse>
    {
        const now =  new Date();
        const challenge = await prisma.challenges.findMany({
            where: {
                challenge: challengeResponse,
                done: false,
                validTo: {
                    gte: now
                }
            }
        });

        if (challenge.length != 1) {
            return {
                success: false
            }
        }

        const foundChallenge = challenge[0];

        await prisma.challenges.update({
            where: {
                id: foundChallenge.id
            },
            data: {
                done: true
            }
        });

        return {
            success: true,
            email: foundChallenge.email,
            appId: foundChallenge.appId
        }
    }
}
