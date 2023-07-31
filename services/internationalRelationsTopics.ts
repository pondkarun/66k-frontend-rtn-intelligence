import Api from "./Api/Api";

const internationalRelationsTopicsService = async () => {
    return await Api.get(`/international_relations_topics/list`);
}

export {
    internationalRelationsTopicsService,
};