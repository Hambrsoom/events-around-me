import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


    @ValidatorConstraint({async: false})
    export class IsPostalCodeValidConstraint implements ValidatorConstraintInterface {
        validate(
            postalCode: string
            ) {
                console.log("hello");
                console.log(postalCode);
                return false;
                // const regex: RegExp = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
                // const match: RegExpExecArray = regex.exec(postalCode);

                // if(match) {
                //     return true;
                // } else {
                //     return false;
                // }
        }
    }

    export function IsPostalCodeValid(
        validationOptions?: ValidationOptions
        ) {
            console.log("SDA");
            return function(object: Object, propertyName: string) {
            registerDecorator({
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: [],
                validator: IsPostalCodeValidConstraint
            });
            };
    }