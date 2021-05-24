import { registerEnumType } from "type-graphql";

export enum Province {
  Quebec = "Quebec",
}

registerEnumType(Province, {
  name: "Province",
});
