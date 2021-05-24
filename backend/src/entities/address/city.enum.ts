import { registerEnumType } from "type-graphql";

export enum City {
  Montreal = "Montreal",
  Kirkland = "Kirkland",
}

registerEnumType(City, {
  name: "City",
});
