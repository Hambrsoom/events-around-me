import { buildSchema } from "type-graphql";

import { AuthResolver } from "../../resolvers/auth.resolver";
import { EventResolver } from "../../resolvers/event.resolver";
import { ImageResolver } from "../../resolvers/image.resolver";
import { OrganizationResolver } from "../../resolvers/organization.resolver";
import { SearchResolver } from "../../resolvers/search.resolver";
import { customAuthChecker } from "./auth-checker";

export const createSchema = async() => await buildSchema({
  authChecker: customAuthChecker,
  emitSchemaFile: true,
  resolvers: [ OrganizationResolver,
      AuthResolver,
      EventResolver,
      ImageResolver,
      SearchResolver,
  ],
});
