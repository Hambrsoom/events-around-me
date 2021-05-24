import { Field, InputType } from "type-graphql";

@InputType()
export default class CoordinatesInput {
  @Field()
  public latitude: number;
  @Field()
  public longitude: number;
}
