import { GraphQLScalarType } from "graphql";
import dayjs from "dayjs";

export const CustomDate = new GraphQLScalarType({
  name: "CustomizedDate",
  description: "Date Scalar",
  parseValue(value: string) {
    return dayjs(value); // value from the client input variables
  },
  serialize(value: any) {
    return value.getTime(); // value sent to the client
  },
});