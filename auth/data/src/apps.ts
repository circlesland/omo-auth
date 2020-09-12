import {prisma} from "./prisma";

export class Apps
{
    static async findById(appId: string)
    {
        return prisma.apps.findOne({where:{appId: appId}})
    }
}
