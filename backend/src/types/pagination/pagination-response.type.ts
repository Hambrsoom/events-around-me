import { Field, ObjectType } from "type-graphql";
import Edge from "./edge.type";
import PageInfo from "./page-info.type";

@ObjectType()
export default class PaginatedResponseClass {
  @Field(() => [Edge])
  public edges: Edge[];

  @Field(() => PageInfo)
  public pageInfo: PageInfo;

  @Field()
  public totalCount: number;
}
