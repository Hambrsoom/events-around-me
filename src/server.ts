
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import * as jwt from "express-jwt";
import { createConnection } from "typeorm";


import { TodoResolver } from './resolvers/todoResolver'
import { AuthResolver } from './resolvers/auth.resolver';

async function main() {
  const schema = await buildSchema({
    resolvers: [TodoResolver, AuthResolver],
    emitSchemaFile: true,
  })

  const app = Express()

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  })

  server.applyMiddleware({ app })

  createConnection().then(async connection => {
    app.listen(4000, () =>
    console.log('Server is running on http://localhost:4000/graphql')
    )
    });
  
}

main()