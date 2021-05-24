import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { User } from "../entities/user/user.entity";

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {
  public validate(
    username: string,
    ) {
      return User.findOne({ where: { username } }).then((user) => {
        if (user) {
          return false;
        }
        return true;
      });
  }
}

export function IsUsernameAlreadyExist(
  validationOptions?: ValidationOptions,
  ) {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        constraints: [],
        options: validationOptions,
        propertyName,
        target: object.constructor,
        validator: IsUsernameAlreadyExistConstraint,
      });
    };
}
