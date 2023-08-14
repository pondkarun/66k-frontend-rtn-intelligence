import Api from "./Api";

const searchInternationalRelationsTopicsService = async (search?: string) => {
    return await Api.get(`/international_relations_topics?search=${search ?? ""}`);
}

const internationalRelationsTopicsService = async () => {
    return await Api.get(`/international_relations_topics/list`);
}

const getByIDInternationalRelationsTopicsService = async (id: string) => {
    return await Api.get(`/international_relations_topics/${id}`);
}

const addInternationalRelationsTopicsService = async (model: any) => {
    return await Api.post(`/international_relations_topics`, model);
}

const updateInternationalRelationsTopicsService = async (model: any, id: string) => {
    return await Api.put(`/international_relations_topics/${id}`, model);
}

export {
    searchInternationalRelationsTopicsService,
    internationalRelationsTopicsService,
    getByIDInternationalRelationsTopicsService,
    addInternationalRelationsTopicsService,
    updateInternationalRelationsTopicsService
};