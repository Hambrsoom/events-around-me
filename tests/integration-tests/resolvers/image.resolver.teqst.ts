import { Connection } from "typeorm";
import { testConn } from "../../test-utils/testConn";
import { gCall } from "../../test-utils/resolver-caller";
import { getAccessToken, insertUser } from "../../test-utils/user-helper-methods";
import { Role } from "../../../src/entities/user/user-role.enum";
import { insertEvent } from "../../test-utils/event-helper-methods";
import { insertOrganization } from "../../test-utils/organisation-helper-methods";
import { GraphQLScalarType } from "graphql";
const fs:any = require("fs");

let connection: Connection;



beforeAll(async() => {
    connection = await testConn();
    await insertOrganization();
    await insertEvent();
});

afterAll(async() => {
    await connection.close();
});

describe("Get Events by Search", () => {
    it("get all the events that will work soon by searching their title", async() => {
        const addImageToEventQuery: string = `mutation addImageToEvent($pictures: [Upload!]!, $eventId: Float!) {
            addImageToEvent(pictures: $pictures, eventId: $eventId)
        }`;
        const eventId: number = 1;


        const username: string = "organizer1234";
        const password: string = "organizer1234";
        await insertUser(username, password, Role.organizer, 1);
        const accessToken: string = await getAccessToken(username, password);

        const context = {
            req: {
                headers: {
                    authorization: accessToken
                }
            }
        };

        const readStream =  fs.createReadStream(__dirname + "/images/Game_of_Thrones_Season_1.jpg");
        let image;

        readStream.on('data', function (chunk) { 
            image += chunk;
        });

        fs.readFile("../images/Game_of_Thrones_Season_1.jpg", async(err, data)=> {
            const images = [image];
            const uploads: GraphQLScalarType[] = images;
            const result: any = await gCall({
                        source: addImageToEventQuery,
                        contextValue: context,
                        variableValues: {
                            pictures: uploads,
                            eventId: eventId
                        }
                });

        })
        
    });
});