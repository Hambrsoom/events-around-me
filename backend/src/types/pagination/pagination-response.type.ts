import { Field, ObjectType, ClassType } from "type-graphql";

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {

    @ObjectType({isAbstract: true})
    abstract class EdgeClass {
        @Field()
        cursor: string;

        @Field(() => TItemClass)
        node: TItem;
    }

    @ObjectType({isAbstract: true})
    abstract class PaginatedResponseClass {
        @Field(() => [EdgeClass])
        edges: EdgeClass[];

        @Field(()=> PageInfo)
        pageInfo: PageInfo;

        @Field()
        totalCount: number;
    }
    return PaginatedResponseClass;
}

@ObjectType()
export class PageInfo {
    @Field({nullable: true})
    endCursor?: string;

    @Field()
    hasNextPage: boolean;
}
