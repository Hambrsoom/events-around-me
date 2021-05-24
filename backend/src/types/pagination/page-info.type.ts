import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class PageInfo {
  @Field({nullable: true})
  public endCursor?: string;

  @Field()
  public hasNextPage: boolean;
}
