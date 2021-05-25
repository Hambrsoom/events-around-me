import { getCustomRepository } from "typeorm";
import { Organization } from "../../src/entities/organization.entity";
import { Role } from "../../src/entities/user/user-role.enum";
import { User } from "../../src/entities/user/user.entity";
import { OrganizationRepository } from "../../src/repositories/organization.repository";
import { UserRepository } from "../../src/repositories/user.repository";
import { LoginUserInput } from "../../src/types/login-user-input.type";
import { RegisterUserInput } from "../../src/types/register-user-input.type";
import { callResolver } from "./resolver-caller";

const loginMutation: string = `mutation login($user: LoginUserInput!) {
  login(user: $user){
    accessToken
    refreshToken
  }
}`;

const registerMutation: string = `mutation registerRegularUser($user: RegisterUserInput!) {
  registerRegularUser(user:$user)
}`;

export const registerUser = async(
    username: string,
    password: string) => {
      const userRepository = getCustomRepository(UserRepository);

      const user: User = await userRepository.findOne({ where: {
        username,
      }});
      if (user === undefined) {
        const userInput: RegisterUserInput = new RegisterUserInput();
        userInput.username = username;
        userInput.password = password;
        await callResolver({
          source: registerMutation,
          variableValues: {
              user: userInput,
          },
        });
      }
};

export const getAccessToken = async(
  username: string,
  password: string) => {
    const userInput: LoginUserInput = new LoginUserInput();
    userInput.username = username;
    userInput.password = password;
    const result: any = await callResolver({
      source: loginMutation,
      variableValues: {
          user: userInput,
      },
    });

    return result.data.login.accessToken;
};

export const insertUser = async(
  username: string,
  password: string,
  role: Role,
  organizationId: string = undefined
  ) => {
    const userRepository = getCustomRepository(UserRepository);
    const organizationRepository = getCustomRepository(OrganizationRepository);

    let user: User = await userRepository.findOne({ where: {
        username,
    }});

    if (user === undefined) {
      user = new User();
      user.username = username;
      user.password = password;
      user.role = role;
      if (organizationId) {
          user.organization = await organizationRepository.findOne({ where: { id: organizationId }});
      }
      await userRepository.save(user);
    }
};
