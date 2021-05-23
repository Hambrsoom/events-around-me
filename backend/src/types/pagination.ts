import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Event } from "../entities/event.entity";

@ObjectType()
export class Edge {
    @Field()
    cursor: string;

    @Field(() => Event)
    node: Event;
}

@ObjectType()
export class PageInfo {
    @Field({nullable: true})
    endCursor?: string;

    @Field()
    hasNextPage: boolean;
}

@ObjectType()
export class EventsCursorResult {
    @Field(() => [Edge])
    edges: Edge[];

    @Field(()=> PageInfo)
    pageInfo: PageInfo;

    @Field()
    totalCount: number;
}

@InputType()
export class CursorInput {
    @Field(() => ID, {nullable: true})
    after?: string;

    @Field({nullable: true})
    first: number;
}
