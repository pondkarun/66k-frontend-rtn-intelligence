export interface loginInterface {
    username: string;
    password: string;
}

export interface changePasswordInterface {
    password_old: string;
    password_new: string;
    password_new_confirm: string;
}