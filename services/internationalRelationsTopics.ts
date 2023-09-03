import { international_relations_topicsAttributes } from "@/interface/international_relations_topics.interface";
import { Tforminternational } from "@/interface/international_relations_datas.interface";
import Api from "./Api";
import type { AxiosResponse } from "axios";

const searchInternationalRelationsTopicsService = async (search?: string) => {
    return await Api.get(`/international_relations_topics?search=${search ?? ""}`);
}

const internationalRelationsTopicsService = async () => {
    return await Api.get(`/international_relations_topics/list`);
}

const internationalRelationsTopicAllsService = async () => {
    return await Api.get(`/international_relations_topics/all`);
}

const getByIDInternationalRelationsTopicsService = async (id: string) => {
    const response: AxiosResponse<international_relations_topicsAttributes> = await Api.get(`/international_relations_topics/${id}`)
    return response.data
}

const addInternationalRelationsTopicsService = async (model: Omit<Tforminternational, 'event_date'>) => {
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
    updateInternationalRelationsTopicsService,
    internationalRelationsTopicAllsService
};