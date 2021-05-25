import { EntityRepository, Repository } from "typeorm";
import { Role } from "../entities/user/user-role.enum";
import { User} from "../entities/user/user.entity";
import NotFoundError from "../error-handlers/not-found.error-handler";
import PersistenceError from "../error-handlers/persistence-error.error-handler";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public async saveUser(
    username: string,
    password: string,
    role: Role,
    ): Promise<User> {
      try {
        const user = this.create({
          username,
          password,
          role,
        });
        return await this.save(user);
      } catch (err) {
        throw new PersistenceError("user", err.message);
      }
  }

  public async findUser(
    userId: string,
    ) {
      try {
        return await this.findOneOrFail(userId, {
            relations: ["organization"],
        });
      } catch (err) {
          throw new NotFoundError(userId, "user", err.message);
      }
  }
}
