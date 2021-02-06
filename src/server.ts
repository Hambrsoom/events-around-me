
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from "typeorm";


import { OrganizationResolver } from './resolvers/organization.resolver'
import { AuthResolver } from './resolvers/auth.resolver';
import { EventResolver } from './resolvers/event.resolver';
import { ProfilePictureResolver } from './resolvers/image.resolver';
import { SearchResolver } from './resolvers/search.resolver';
import { customAuthChecker } from './utilities/authChecker';

async function main() {
  const schema = await buildSchema({
    resolvers: [OrganizationResolver, AuthResolver, EventResolver, ProfilePictureResolver, SearchResolver],
    emitSchemaFile: true,
    authChecker: customAuthChecker
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

main();
