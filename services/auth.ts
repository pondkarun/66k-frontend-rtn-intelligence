import { loginInterface } from "@/interface/auth.interface";
import Api from "./Api/Api";

const loginService = async (body: loginInterface) => {
    return await Api.post(`/auth/login`, body);
}

export {
    loginService,
};