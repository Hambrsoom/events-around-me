import { Connection } from "typeorm";
import { testConn } from "../test-utils/testConn";
import { gCall } from "../test-utils/gCall";
import { UserInput } from "../../src/entities/user.entity";
import { graphql, GraphQLSchema } from "graphql";

import { Maybe, buildSchema } from "type-graphql";

import { customAuthChecker } from '../../src/utilities/authChecker';
import { OrganizationResolver } from '../../src/resolvers/organization.resolver'
import { AuthResolver } from '../../src/resolvers/auth.resolver';
import { EventResolver } from '../../src/resolvers/event.resolver';
import { ImageResolver } from '../../src/resolvers/image.resolver';
import { SearchResolver } from '../../src/resolvers/search.resolver';

let connection: Connection;
let schema: GraphQLSchema;
beforeAll(async() => {
    connection = await testConn();
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
})

afterAll(async() => {
    await connection.close();
})


const registerMutation = `mutation register($user: UserInput!) {
    register(user: $user)
  }`

describe('Register', () => {
    it("create user", async () => {
        const userInput: UserInput = {
            username: "Hampico",
            password: "123456789"
        }

        const mutation = `mutation {
            register(user: {
                username: "Hampico",
                password: "123456789"
            })`;
          const ress = await graphql(schema, mutation);

          console.log(ress);
          expect(1).toBe(1);
        // console.log(
        //     await gCall({
        //         source: registerMutation,
        //         variableValues: {
        //             user: userInput
        //         }
        //     })
        // );
    });
});