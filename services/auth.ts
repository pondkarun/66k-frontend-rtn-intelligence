import { changePasswordInterface, loginInterface } from "@/interface/auth.interface";
import api from "./Api/Api";
import Api from "./Api";

const loginService = async (body: loginInterface) => {
    return await api.post(`/auth/login`, body);
}

const changePasswordService = async (body: changePasswordInterface) => {
    return await Api.post(`/auth/change-password`, body);
}

export {
    loginService,
    changePasswordService,
};