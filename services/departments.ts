import Api from "./Api";

const getAllDepartmentsService = async () => {
    return await Api.get(`/departments`);
}

export {
    getAllDepartmentsService,
};