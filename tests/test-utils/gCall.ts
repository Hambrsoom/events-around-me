import { graphql } from "graphql";

import { createSchema } from "../../src/utilities/createSechema";

interface IOptions {
  source: string;
  variableValues?: any;
  contextValue?: any;
}


export const gCall = async ({ source, variableValues, contextValue }: IOptions) => {
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
    contextValue
  });
};