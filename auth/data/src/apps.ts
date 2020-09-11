export class Apps
{
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
