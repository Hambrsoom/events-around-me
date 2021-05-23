import queryComplexity, {
    fieldExtensionsEstimator,
  simpleEstimator
} from "graphql-query-complexity";

export const validationRules: any =  [
    queryComplexity({
      maximumComplexity: 150,
      variables: {},
      onComplete: (complexity: number) => {
        console.log("Query Complexity:", complexity);
      },
      estimators: [
        fieldExtensionsEstimator(),
        simpleEstimator({
          defaultComplexity: 1
        })
      ]
    }) as any
];

