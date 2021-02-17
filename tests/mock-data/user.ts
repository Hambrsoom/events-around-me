import { User } from "../../src/entities/user/user.entity";

export class UserMockedData {
    public static async getRegularUser(): Promise<User> {
        const user: User = new User();
        user.username = "Hampic";
        user.password = "12345678";

        return user;
    }
}