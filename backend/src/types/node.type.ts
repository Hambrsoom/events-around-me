import { Field, ID, InterfaceType } from "type-graphql";

@InterfaceType({ autoRegisterImplementations: false })
export default abstract class INode {
  @Field(() => ID)
  public id?: string;
}
