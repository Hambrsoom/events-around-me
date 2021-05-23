import { registerEnumType } from "type-graphql";

export enum Province {
    Quebec = "qc"
}


registerEnumType(Province, {
    name: "Province"
});