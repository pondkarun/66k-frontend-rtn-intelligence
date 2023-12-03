import Api from "./Api/Api";

const getConfigAllService = async () => {
    return await Api.get(`/configs`);
}
export {
    getConfigAllService
};