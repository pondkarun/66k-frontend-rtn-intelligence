import { loginInterface } from "@/interface/auth.interface";
import Api from "./Api";

const login = async (body: loginInterface) => {
    return await Api.post(`/api/auth/login`, body);
}

export {
    login,
};