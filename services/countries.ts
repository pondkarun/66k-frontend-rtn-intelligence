import Api from "./Api/Api";

const countriesService = async () => {
    return await Api.get(`/countries/list`);
}

const countriesAllService = async () => {
    return await Api.get(`/countries`);
}

const getByIdCountriesAllService = async (id: string) => {
    return await Api.get(`/countries/${id}`);
}

export {
    countriesService,
    countriesAllService,
    getByIdCountriesAllService
};