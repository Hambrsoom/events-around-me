import { EntityRepository, Repository } from "typeorm";
import { Role } from "../entities/user/user-role.enum";
import { User} from "../entities/user/user.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import PersistenceError from "../error-handlers/persistence-error.error-handler";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public static async save(
    username: string,
    password: string,
    role: Role,
    ): Promise<User> {
      try {
        return await this.save(username,
          password,
          role);
      } catch (err) {
        throw new PersistenceError("user", err.message);
      }
  }

  public static async findOneOrFail(
    userId: string
    ) {
      try {
        return await User.findOneOrFail(userId, {
            relations: ["organization"],
        });
      } catch (err) {
          throw new NotFoundError(userId, "user", err.message);
      }
  }
}
