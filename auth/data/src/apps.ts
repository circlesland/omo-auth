import {prisma} from "./prisma";

export class Apps
{
    static async findById(appId: string)
    {
        return prisma.apps.findOne({where:{appId: appId}})
    }

    /**
     * Adds a new origin to the list of allowed origins (these will be included in the jwt's 'audience' claim)
     * @param originHeaderValue
     */
    static async add(originHeaderValue:string) : Promise<number>
    {
        return 0;
    }

    /**
     * Removes an app/origin from the list of allowed origins.
     * @param id
     */
    static async remove(id:number)
    {
    }
}
