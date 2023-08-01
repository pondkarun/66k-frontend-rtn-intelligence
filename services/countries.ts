import Api from "./Api/Api";

const countriesService = async () => {
    return await Api.get(`/countries/list`);
}

const countriesAllService = async () => {
    return await Api.get(`/countries`);
}

export {
    countriesService,
    countriesAllService
};