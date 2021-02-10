import { buildSchema } from 'type-graphql';

import { customAuthChecker } from './authChecker';
import { OrganizationResolver } from '../resolvers/organization.resolver'
import { AuthResolver } from '../resolvers/auth.resolver';
import { EventResolver } from '../resolvers/event.resolver';
import { ImageResolver } from '../resolvers/image.resolver';
import { SearchResolver } from '../resolvers/search.resolver';

export const createSchema = async() => {
    return await buildSchema({
        resolvers: [ OrganizationResolver,
            AuthResolver,
            EventResolver,
            ImageResolver,
            SearchResolver],
        emitSchemaFile: true,
        authChecker: customAuthChecker
    })
}