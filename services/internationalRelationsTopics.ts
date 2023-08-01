import Api from "./Api/Api";

const internationalRelationsTopicsService = async () => {
    return await Api.get(`/international_relations_topics/list`);
}

const getByIDInternationalRelationsTopicsService = async (id: string) => {
    return await Api.get(`/international_relations_topics/${id}`);
}

export {
    internationalRelationsTopicsService,
    getByIDInternationalRelationsTopicsService
};