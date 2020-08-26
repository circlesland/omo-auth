import {ApolloServer} from "apollo-server";
import {Resolvers} from "./api/resolvers";

// TODO: Migrate to GraphQL-tools: https://www.graphql-tools.com/docs/migration-from-import/
import {importSchema} from "graphql-import";

export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;

    constructor()
    {
        if (!process.env.AUTH_SERVICE_GRAPHQL_SCHEMA)
        {
            throw new Error("The AUTH_SERVICE_GRAPHQL_SCHEMA environment variable must contain a valid path that " +
                "points to the GraphQL api schema.");
        }
        const apiSchemaTypeDefs = importSchema(process.env.AUTH_SERVICE_GRAPHQL_SCHEMA);

        this._resolvers = new Resolvers();

        this._server = new ApolloServer({
            typeDefs: apiSchemaTypeDefs,
            resolvers: {
                Mutation: this._resolvers.mutationResolvers,
                Query: this._resolvers.queryResolvers
            }
        });
    }

    async run()
    {
        if (!process.env.AUTH_SERVICE_PORT)
        {
            throw new Error("The AUTH_SERVICE_PORT environment variable is not set.");
        }

        await this._server.listen({
            port: parseInt(process.env.AUTH_SERVICE_PORT)
        });
    }
}

new Main()
    .run()
    .then(() => "Running");
