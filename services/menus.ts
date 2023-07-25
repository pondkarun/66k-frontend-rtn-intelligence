import Api from "./Api/Api";

const menusService = async () => {
    return await Api.get(`/menus/list`);
}

export {
    menusService,
};