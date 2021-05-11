import { registerEnumType } from "type-graphql";

export enum Country {
    Canada = "Canada"
}


registerEnumType(Country, {
    name: "Country"
});