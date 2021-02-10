import { graphql } from 'graphql';

import { createSchema } from '../../src/utilities/createSechema';

export const graphQLCall = async (source: string, variableValues: any) => {
    console.log(variableValues);
    return graphql({
        schema: await createSchema(),
        source,
        variableValues
    })
}
