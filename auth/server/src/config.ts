export const config = {
    server: {
        port: 5000
    },
    graphql: {
        schemaPath: "src/api/api-schema.graphql"
    },
    authentication: {
        jwtSecret: "4", // Guaranteed to be random. Chosen by dice roll
        jwtIssuer: "Abis"
    }
}
