import { Field, ObjectType } from "type-graphql";
import INode from "../node.type";

@ObjectType()
export default class Edge {
  @Field()
  public cursor: string;

  @Field(() => INode)
  public node: INode;
}
