import { gCall } from "./gCall";
import { User, UserInput } from "../../src/entities/user/user.entity";
import { Role } from "../../src/entities/user/user-role.enum";

import bcrypt from "bcrypt";
import { UserService } from "../../src/services/user.service";
import { Organization } from "../../src/entities/organization.entity";

const loginMutation: string = `mutation login($password:String! , $username: String!){
    login(password:$password, username:$username){
      accessToken
      refreshToken
    }
}`;

const registerMutation: string = `mutation register($user: UserInput!) {
    register(user:$user)
}`;



export const registerUser = async(username: string, password: string) => {
    const user: User = await User.findOne({ where: {
        username: username
    }});
    if(user === undefined) {
        const userInput: UserInput = new UserInput();
        userInput.username= username;
        userInput.password= password;
        await gCall({
            source: registerMutation,
            variableValues: {
                user: userInput
            }
        });
    }
};

export const getAccessToken = async(username: string, password: string) => {
    const result: any = await gCall({
        source: loginMutation,
        variableValues: {
            username: username,
            password: password
        }
    });
    return result.data.login.accessToken;
};

export const insertUser = async(username: string, password: string, role: Role, organizationId: number = undefined) => {
    const user: User = await User.findOne({ where: {
        username: username
    }});
    if(user === undefined) {
        let user:User = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        if(organizationId !== undefined){
            user.organization = await Organization.findOne({ where: { id: organizationId }});
        }
        const salt:any = await bcrypt.genSalt();
        user.salt = salt;
        user.hashPassword();
        await UserService.saveUser(user);
    }
}
