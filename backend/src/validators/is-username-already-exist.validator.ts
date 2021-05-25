import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/user.repository";

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {
  public validate(
    username: string,
    ) {
      const userRepository = getCustomRepository(UserRepository);
      return userRepository.findOne({ where: { username } }).then((user) => {
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
