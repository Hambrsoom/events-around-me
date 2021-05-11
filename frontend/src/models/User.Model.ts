export interface User {
    id: string;
    username: string;
    role: Role;
}

export interface RegisterUserInput {
    username: string,
    password: string
}

export interface LoginUserInput {
    username: string,
    password: string
}

export enum Role {
    admin = "ADMIN",
    organizer = "ORGANIZER",
    regular = "REGULAR"
};