import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from 'express';
import { createConnection } from "typeorm";

import { createSchema } from './utilities/createSechema';
import  config  from "../config/config";

const port: number = config.appPort || 5000;

async function main() {
  const schema = await createSchema()
  const app = Express()

  app.use("/images", Express.static("images"));

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }) 
   })

  server.applyMiddleware({ app })

  createConnection().then(async connection => {
    app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}/graphql`)
    )
    });
}

main();
