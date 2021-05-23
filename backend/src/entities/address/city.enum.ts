import { registerEnumType } from "type-graphql";

export enum City {
    Montreal = "montreal",
    Kirkland = "kirkland"
}


registerEnumType(City, {
    name: "City"
});