import { registerEnumType } from "type-graphql";

export enum Country {
    Canada = "canada"
}


registerEnumType(Country, {
    name: "Country"
});