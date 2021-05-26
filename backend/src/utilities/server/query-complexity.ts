import queryComplexity, {
    fieldExtensionsEstimator,
  simpleEstimator,
} from "graphql-query-complexity";
import logger from "../logger/logger";

export const validationRules: any =  [
    queryComplexity({
      estimators: [
        fieldExtensionsEstimator(),
        simpleEstimator({
          defaultComplexity: 1,
        }),
      ],
      maximumComplexity: 20,
      onComplete: (complexity: number) => {
        logger.info({
          message: `Query Complexity: ${complexity}`,
        });
      },
      variables: {},
    }) as any,
];

