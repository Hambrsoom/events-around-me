import { Field, InputType } from "type-graphql";

@InputType()
export class ICoordinates {
    @Field()
    latitude: number;
    @Field()
    longitude: number;

    convertCoordintatesToString = () => {
        return this.latitude + "," + this.longitude;
    }
}
