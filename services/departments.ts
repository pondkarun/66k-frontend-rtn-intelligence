import Api from "./Api";

const getAllDepartmentsService = async (search?: string) => {
    return await Api.get(`/departments?search=${search ?? ""}`);
}

const getAllDepartmentsListService = async (search?: string) => {
    return await Api.get(`/departments/list`);
}

const getByIDDepartmentsService = async (id: string) => {
    return await Api.get(`/departments/${id}`)
}

const addDepartmentsService = async (body: any) => {
    return await Api.post(`/departments`, body)
}

const updateDepartmentsService = async (body: any, id: string) => {
    return await Api.put(`/departments/${id}`, body)
}

export {
    getAllDepartmentsService,
    getAllDepartmentsListService,
    getByIDDepartmentsService,
    addDepartmentsService,
    updateDepartmentsService,
};