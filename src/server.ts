
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { createConnection } from "typeorm";

import { createSchema } from './utilities/createSechema';
import redis from "redis";

// redis port number: 6379

export const redisClient = redis.createClient(6379, "127.0.0.1");

async function main() {
  const schema = await createSchema()
  const app = Express()

  app.use(Express.static('images'));

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

    redisClient.on('connect', function() {
      console.log('connected');
  });
}

main();
