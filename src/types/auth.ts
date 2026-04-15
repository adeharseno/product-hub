export type LoginRequest = {
    username: string;
    password: string;
};

export type User = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
};

export interface LoginResponse extends User {
    accessToken: string;
    refreshToken: string;
}
