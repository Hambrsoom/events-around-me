import { callResolver } from "./resolver-caller";
import { User, LoginUserInput, RegisterUserInput } from "../../src/entities/user/user.entity";
import { Role } from "../../src/entities/user/user-role.enum";

import bcrypt from "bcrypt";
import { Organization } from "../../src/entities/organization.entity";

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
        const user: User = await User.findOne({ where: {
            username: username
        }});
        if(user === undefined) {
            const userInput: RegisterUserInput = new RegisterUserInput();
            userInput.username= username;
            userInput.password= password;
            await callResolver({
                source: registerMutation,
                variableValues: {
                    user: userInput
                }
            });
        }
};

export const getAccessToken = async(
    username: string,
    password: string) => {
        const userInput: LoginUserInput = new LoginUserInput();
        userInput.username= username;
        userInput.password= password;
        const result: any = await callResolver({
            source: loginMutation,
            variableValues: {
                user: userInput
            }
        });

        return result.data.login.accessToken;
};

export const insertUser = async(username: string, password: string, role: Role, organizationId: string = undefined) => {
    const user: User = await User.findOne({ where: {
        username: username
    }});

    console.log(user);
    if(user === undefined) {
        let user:User = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        if(organizationId !== undefined) {
            user.organization = await Organization.findOne({ where: { id: organizationId }});
        }
        const salt:any = await bcrypt.genSalt();
        user.salt = salt;
        user.hashPassword();
        await User.save(user);
    }
}
