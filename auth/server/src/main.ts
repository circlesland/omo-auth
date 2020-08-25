import {ApolloServer} from "apollo-server";
import {Resolvers} from "./api/resolvers";
import {config} from "./config";

const {importSchema} = require('graphql-import')

export class Main
{
    private readonly _server: ApolloServer;
    private readonly _resolvers: Resolvers;

    constructor()
    {
        const apiSchemaTypeDefs = importSchema(config.graphql.schemaPath);

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
        await this._server.listen(config.server.port);
    }
}

new Main()
    .run()
    .then(() => "Running");
