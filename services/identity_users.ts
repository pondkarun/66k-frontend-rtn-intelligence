import Api from "./Api";

const searchIdentityUsersService = async (search?: string) => {
    return await Api.get(`/identity_users?search=${search ?? ""}`);
}

const getByIdIdentityUsersService = async (id?: string) => {
    return await Api.get(`/identity_users/${id}`);
}

const addIdentityUsersService = async (model: any) => {
    return await Api.post(`/identity_users`, model);
}

const updateIdentityUsersService = async (model: any, id: string) => {
    return await Api.put(`/identity_users/${id}`, model);
}

export {
    searchIdentityUsersService,
    getByIdIdentityUsersService,
    addIdentityUsersService,
    updateIdentityUsersService,
};