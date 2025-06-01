export interface CreateUserDto {
    userId: string;
    password: string;
    username: string;
    provider: null | string;
    providerId: null | string;
    authCode: string;
}