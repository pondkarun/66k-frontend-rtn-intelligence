import Api from "./Api/Api";

const countriesService = async () => {
    return await Api.get(`/countries/list`);
}

export {
    countriesService,
};