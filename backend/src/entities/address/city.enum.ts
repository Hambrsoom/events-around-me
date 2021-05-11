import { registerEnumType } from "type-graphql";

export enum City {
    Montreal = "Montreal"
}


registerEnumType(City, {
    name: "City"
});