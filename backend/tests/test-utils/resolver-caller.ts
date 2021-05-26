import { graphql } from "graphql";
import { createSchema } from "../../src/utilities/server/create-schema";

interface IOptions {
  source: string;
  variableValues?: any;
  contextValue?: any;
}

export const callResolver = async ({ source, variableValues, contextValue }: IOptions) => {
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
    contextValue,
  });
};
