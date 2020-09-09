import {KeyPair} from "@omo/auth-data/dist/keyPair";

export class KeyRotator
{
    private _intervalHandle?:number;

    async start(invalidateEveryNSeconds: number)
    {
        if (this._intervalHandle)
        {
            throw new Error("The KeyRotator was already started.");
        }
        if (invalidateEveryNSeconds < 30)
        {
            throw new Error("The minimum lifetime of key pairs must be 30 seconds.")
        }

        await this._ensureValidKeyPair();

        setInterval(async () =>
        {
            await this._ensureValidKeyPair();
        }, invalidateEveryNSeconds * 1000);
    }

    stop()
    {
        // TODO: Find a way to correctly stop the nodejs timer
        if (!this._intervalHandle)
        {
            throw new Error("The KeyRotator wasn't running.")
        }
        clearInterval(this._intervalHandle);
        this._intervalHandle = undefined;
    }

    /**
     * Checks if a valid key pair exists. If not, a new one is created.
     * @private
     */
    private async _ensureValidKeyPair()
    {
        const keyPair = await KeyPair.findValidKey();
        if (!keyPair) {
            await KeyPair.createKeyPair();
        }
    }
}
