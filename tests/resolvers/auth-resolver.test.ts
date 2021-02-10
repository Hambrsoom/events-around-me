import { graphql } from "graphql";
import { Connection } from "typeorm";
import { createSchema } from "../../src/utilities/createSechema";
import { graphQLCall } from "../test-utils/graphQLCall";
import { testConn } from "../../testConnection"

let connection: Connection;
beforeAll(async() => {
    connection = await testConn();
})

afterAll(async() => {
    await connection.close();
})


const registerMutation = `mutation ($user: UserInput!) {
    register(user: $user)}`

describe('Register', () => {
    it("create user", async () => {
        const schema = await createSchema();
        const mutation = `mutation {
            register(user: {
                username: "hampic",
                password: "1234567812"
            })
        }`;
        const temp = await graphql(schema, mutation)
        console.log(temp);
    })
})