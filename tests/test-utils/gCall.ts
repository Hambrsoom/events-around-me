import { graphql, GraphQLSchema } from "graphql";
import { Maybe, buildSchema } from "type-graphql";

import { createSchema } from "../../src/utilities/createSechema";

import { customAuthChecker } from '../../src/utilities/authChecker';
import { OrganizationResolver } from '../../src/resolvers/organization.resolver'
import { AuthResolver } from '../../src/resolvers/auth.resolver';
import { EventResolver } from '../../src/resolvers/event.resolver';
import { ImageResolver } from '../../src/resolvers/image.resolver';
import { SearchResolver } from '../../src/resolvers/search.resolver';

interface IOptions {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: IOptions) => {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [ OrganizationResolver,
          AuthResolver,
          EventResolver,
          ImageResolver,
          SearchResolver
      ],
      emitSchemaFile: true,
      authChecker: customAuthChecker
  })
  }
  console.log(variableValues);
  return graphql({
    schema,
    source,
    variableValues
  });
};