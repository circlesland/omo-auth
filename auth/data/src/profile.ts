import {prisma} from "./prisma";

export class Profile
{
    public static async createProfile(email:string, schemaId:string, data:string) {
        return await prisma.profile.create({
            data: {
                email: email,
                schemaId: schemaId,
                document: data
            }
        });
    }

    public static async getProfile(email:string) {
        return await prisma.profile.findOne({
            where: {
                email: email
            }
        });
    }
}
