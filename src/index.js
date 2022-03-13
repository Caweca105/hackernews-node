const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');
const fs = require('fs');
const path = require('path');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const { PubSub } = require('apollo-server');
const Vote = require('./resolvers/Vote');

const pubsub = new PubSub()
// The links variable is used to store the links at runtime. 
// For now, everything is stored only in-memory rather than being persisted in a database.
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

// The resolvers object is the actual implementation of the GraphQL schema. 
// Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info.©
const resolvers = {
    Query,
    Mutation,
    User,
    Subscription,
    Link,
    Vote,
}

const prisma = new PrismaClient()
// Finally, the schema and resolvers are bundled and passed to ApolloServer which is imported from apollo-server. 
// This tells the server what API operations are accepted and how they should be resolved.
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                ? getUserId
                : null
        };
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );